import Application from "../models/Application.js";
import User from "../models/User.js";

// Submit loan application
export const submitApplication = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      loanAmount,
      loanType,
      purpose,
      fullName,
      phoneNumber,
      email,
      dateOfBirth,
      monthlyIncome,
      address
    } = req.body;

    // Validate required fields
    if (!loanAmount || !purpose || !fullName || !phoneNumber || !email || !dateOfBirth || !monthlyIncome || !address) {
      return res.status(400).json({ 
        success: false, 
        message: "All required fields must be filled" 
      });
    }

    // Check if user already has a pending application
    const existingApplication = await Application.findOne({ 
      userId, 
      status: 'pending' 
    });
    
    if (existingApplication) {
      return res.status(400).json({ 
        success: false, 
        message: "You already have a pending application" 
      });
    }

    // Create new application
    const application = new Application({
      userId,
      loanAmount,
      loanType: loanType || 'personal',
      purpose,
      fullName,
      phoneNumber,
      email,
      dateOfBirth,
      monthlyIncome,
      address,
      status: 'pending'
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: {
        applicationId: application.applicationId,
        loanAmount: application.loanAmount,
        status: application.status,
        submittedAt: application.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get user's applications
export const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const applications = await Application.find({ userId })
      .select('applicationId loanAmount loanType purpose status createdAt reviewedAt adminComments finalDecision')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get single application by ID
export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.userId;
    
    const application = await Application.findOne({ 
      applicationId, 
      userId 
    }).populate('reviewedBy', 'fullName');

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: "Application not found" 
      });
    }

    res.json({
      success: true,
      application
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin: Get all applications
export const getAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate('userId', 'name email')
      .populate('reviewedBy', 'fullName')
      .select('-address') // Hide full address in listing
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(filter);

    res.json({
      success: true,
      applications,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin: Get single application with full details
export const getApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await Application.findOne({ applicationId })
      .populate('userId', 'name email createdAt')
      .populate('reviewedBy', 'fullName employeeId')
      .populate('finalDecision.decidedBy', 'fullName employeeId');

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: "Application not found" 
      });
    }

    res.json({
      success: true,
      application
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin: Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { decision, reason, approvedAmount, comments } = req.body;
    const adminId = req.admin.adminId;

    // Validate decision
    if (!decision || !['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({ 
        success: false, 
        message: "Valid decision (approved/rejected) is required" 
      });
    }

    const application = await Application.findOne({ applicationId });
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: "Application not found" 
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: "Application has already been processed" 
      });
    }

    // Update application
    application.status = decision;
    application.reviewedBy = adminId;
    application.reviewedAt = new Date();
    application.adminComments = comments;
    
    application.finalDecision = {
      decision,
      reason,
      approvedAmount: decision === 'approved' ? (approvedAmount || application.loanAmount) : null,
      decidedBy: adminId,
      decidedAt: new Date()
    };

    await application.save();

    // Populate admin details for response
    await application.populate('reviewedBy', 'fullName employeeId');

    res.json({
      success: true,
      message: `Application ${decision} successfully`,
      application: {
        applicationId: application.applicationId,
        status: application.status,
        finalDecision: application.finalDecision,
        reviewedBy: application.reviewedBy,
        reviewedAt: application.reviewedAt
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Admin: Get application statistics
export const getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$loanAmount' }
        }
      }
    ]);

    const totalApplications = await Application.countDocuments();
    const recentApplications = await Application.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      success: true,
      stats: {
        total: totalApplications,
        recent: recentApplications,
        byStatus: stats.reduce((acc, item) => {
          acc[item._id] = {
            count: item.count,
            totalAmount: item.totalAmount
          };
          return acc;
        }, {})
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};
