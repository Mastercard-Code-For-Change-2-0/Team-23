import express from 'express';

const studentRegister = async(req,res) =>{
    try {
        const { name, email, phone, college, year, field_of_study } = req.body;
        if(!name || !email || !phone || !college || !year || !field_of_study) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newStudent = new Student({ name, email, phone, college, year, field_of_study });

        await newStudent.save();

        res.status(201).json({ message: "Student registered successfully", student: newStudent });
    } catch (error) {
        res.status(500).json({ message: "Error registering student", error });
    }
}

const getAllStudents = async(req,res) =>{
    try {
        const students = await Student.find().populate('event');
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error });
    }
}

const getStudentById = async(req,res) =>{
    try {
        const { id } = req.params;
        const student = await Student.findById(id).populate('event');
        if(!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ student });
    } catch (error) {
        res.status(500).json({ message: "Error fetching student", error });
    }
}

const getStudentByEventId = async(req,res) =>{
    try {
        const { eventId } = req.params;
        const students = await Student.find({ event: eventId }).populate('event');
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error });
    }
}
