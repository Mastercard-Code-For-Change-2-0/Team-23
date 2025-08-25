import Event from "../models/events.model.js";

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch events" });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { Title, Description, StartDate, EndDate, Location, AdminID } = req.body || {};

    if (!Title || !StartDate || !EndDate) {
      return res.status(400).json({ success: false, error: "Title, StartDate and EndDate are required" });
    }

    const event = await Event.create({
      Title,
      Description: Description || "",
      StartDate: new Date(StartDate),
      EndDate: new Date(EndDate),
      Location: Location || "",
      AdminID: AdminID || 0,
    });

    return res.status(201).json({ success: true, event });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ success: false, error: "Failed to create event" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    if (updates.StartDate) updates.StartDate = new Date(updates.StartDate);
    if (updates.EndDate) updates.EndDate = new Date(updates.EndDate);

    const event = await Event.findByIdAndUpdate(id, updates, { new: true });
    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    return res.status(200).json({ success: true, event });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ success: false, error: "Failed to update event" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }
    return res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ success: false, error: "Failed to delete event" });
  }
};
