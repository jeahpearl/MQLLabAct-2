const Student = require('../models/Student');
const mongoose = require('mongoose');

/**
 * GET /
 *  Homepage
 */
exports.homepage = async (req,res) => {
    const messages = await req.flash("info");
    const locals = {
        title:'Daligdig Lab Act #2',
        description:'Exploring Front-End Development: MongoDB CRUD with Search Function'
    };

    let perPage = 12;
    let page = req.query.page || 1;


    try {
        const students = await Student.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

    const count = await Student.countDocuments({});

    res.render("index", {
        locals,
        students,
        current: page,
        pages: Math.ceil(count / perPage),
        messages,
    });
    
    } catch (error) {
        console.log(error);
    }

};

/**
 * GET /
 * About
 */
exports.about = async (req, res) => {
    const locals = {
        title: "About",
        description: "MongoDB CRUD with Search Function",
    };

    try {
        res.render("about", locals);
    } catch (error) {
        console.log(error);
    }
};

/**
 * GET /
 *  New Student Form
 */

exports.addStudent = async (req,res) => {
    const locals = {
        title:'Add New Student',
        description:'New Student'
    }
    res.render('student/add', locals);
}

/**
 * POST /
 *  Create New Student 
 */

exports.postStudent = async (req,res) => {
    console.log(req.body);

    const newStudent = new Student ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        contactNum: req.body.contactNum,
        email: req.body.email
    });

    

    try {
        await Student.create(newStudent);
        await req.flash("info", "New student has been added.");
        res.redirect('/');
    }   catch (error) {
        console.log(error);
    }


};

/**
 * Get /
 * Search Student Data
 */

exports.view = async (req,res) => {

    try {
        const student = await Student.findOne({ _id: req.params.id })

        const locals = {
            title: "View Student Data",
            description: "MongoDB CRUD with Search Function",
        };

        res.render('student/view', {
            locals,
            student,
        });

    } catch (error) {
        console.log(error); 
    }

};

/**
 * Get /
 * Edit Student Data
 */

exports.edit = async (req,res) => {

    try {
        const student = await Student.findOne({ _id: req.params.id })

        const locals = {
            title: "Edit Student Data",
            description: "MongoDB CRUD with Search Function",
        };

        res.render('student/edit', {
            locals,
            student,
        });

    } catch (error) {
        console.log(error); 
    }

};

/**
 * Get /
 * Update Student Data
 */

exports.editPost = async (req,res) => {
    try {
    await Student.findByIdAndUpdate(req.params.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contactNum: req.body.contactNum,
        email: req.body.email,
        details: req.body.details,
        updatedAt: Date.now(),
        });
        await res.redirect(`/edit/${req.params.id}`);
    
        console.log("redirected");
    } catch (error) {
        console.log(error);
    }
};

/**
 * Delete /
 * Delete Student Data
 */

exports.deleteStudent = async (req, res) => {
    try {
    await Student.deleteOne({ _id: req.params.id });
        res.redirect("/");
    await req.flash("info", "Student has been deleted.");
    res.redirect('/');
    } catch (error) {
        console.log(error);
    }
};

/**
 * Get /
 * Search Student Data
 */

exports.searchStudents = async (req, res) => {
    const locals = {
        title: "Search Student Data",
        description: "MongoDB CRUD with Search Function",
    };
    
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    
        const students = await Student.find({
        $or: [
            { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
            { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        ],
        });
    
        res.render("search", {
            students,
            locals,
        });
    } catch (error) {
        console.log(error);
    }
};