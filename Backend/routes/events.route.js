import express from 'express';
import Event from '../models/events.model.js';
import EventApplication from '../models/eventApplication.model.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get all events (public route)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ CreatedAt: -1 });
    res.status(200).json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
});

// Create new event (admin only)
router.post('/create', verifyJWT, async (req, res) => {
  try {
    const { EventID, Title, Description, StartDate, EndDate, Location, AdminID } = req.body;

    // Check if EventID already exists
    const existingEvent = await Event.findOne({ EventID });
    if (existingEvent) {
      return res.status(400).json({
        success: false,
        error: 'Event ID already exists'
      });
    }

    const newEvent = new Event({
      EventID,
      AdminID: AdminID || 1, // Default admin ID
      Title,
      Description,
      StartDate,
      EndDate,
      Location
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create event'
    });
  }
});

// Apply for an event (authenticated users)
router.post('/apply', async (req, res) => {
  try {
    const { 
      eventId, 
      studentName, 
      phoneNumber, 
      college, 
      yearOfStudy, 
      fieldOfStudy, 
      otherFieldOfStudy 
    } = req.body;
    // const userId = req.user._id;

    // Validate required fields
    if (!eventId || !studentName || !phoneNumber || !college || !yearOfStudy || !fieldOfStudy) {
      return res.status(400).json({
        success: false,
        error: 'All registration fields are required'
      });
    }

    // Validate phone number format
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit phone number'
      });
    }

    // Validate fieldOfStudy and otherFieldOfStudy
    if (fieldOfStudy === 'Other' && !otherFieldOfStudy) {
      return res.status(400).json({
        success: false,
        error: 'Please specify your field of study when selecting "Other"'
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Check if user has already applied
    // const existingApplication = await EventApplication.findOne({
    //   userId,
    //   eventId
    // });

    // if (existingApplication) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'You have already applied for this event'
    //   });
    // }

    // Create new application with registration data
    const application = new EventApplication({
      // userId,
      eventId,
      studentName,
      phoneNumber,
      college,
      yearOfStudy,
      fieldOfStudy,
      otherFieldOfStudy: fieldOfStudy === 'Other' ? otherFieldOfStudy : undefined
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Successfully applied for the event'
    });
  } catch (error) {
    console.error('Error applying for event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to apply for event'
    });
  }
});

// Get user's applied events
router.get('/applied', verifyJWT, async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await EventApplication.find({ userId })
      .populate('eventId')
      .sort({ appliedAt: -1 });

    const appliedEvents = applications.map(app => app.eventId._id.toString());

    res.status(200).json({
      success: true,
      appliedEvents
    });
  } catch (error) {
    console.error('Error fetching applied events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applied events'
    });
  }
});

// Get event registrations (admin only)
router.get('/:eventId/registrations', verifyJWT, async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await EventApplication.find({ eventId })
      .populate('studentName')
      .sort({ appliedAt: -1 });

    const registrationData = registrations.map(reg => ({
     
      // email: reg.userId.email,
      studentName: reg.studentName,
      phoneNumber: reg.phoneNumber,
      college: reg.college,
      yearOfStudy: reg.yearOfStudy,
      fieldOfStudy: reg.fieldOfStudy,
      otherFieldOfStudy: reg.otherFieldOfStudy,
      appliedAt: reg.appliedAt,
      status: reg.status
    }));

    res.status(200).json({
      success: true,
      registrations: registrationData
    });
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event registrations'
    });
  }
});

// Get single event details
router.get('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    });
  }
});

// Update event (admin only)
router.put('/:eventId', verifyJWT, async (req, res) => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update event'
    });
  }
});

// Delete event (admin only)
router.delete('/:eventId', verifyJWT, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Delete all applications for this event first
    await EventApplication.deleteMany({ eventId });

    // Delete the event
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete event'
    });
  }
});

export default router;
