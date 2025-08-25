import Event from "../models/events.model.js";

export async function getAllEvents(_, res) {
  try {
    const event = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(event);
  } catch (error) {
    console.error("Error in getAllEvents controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createEvent(req, res) {
  try {
    const { AdminID, Title, Description, StartDate, EndDate, Location } = req.body;
    const event = new Event({ AdminID, Title, Description, StartDate, EndDate, Location });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error in createEvent controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateEvent(req, res) {
  try {
    const { title, content } = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, StartDate, EndDate, Location },
      {
        new: true,
      }
    );

    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error in updateEvent controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteEvent(req, res) {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteEvent controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
