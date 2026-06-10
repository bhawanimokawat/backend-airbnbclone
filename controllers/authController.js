const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        pagetitle: "Login System",
        isLoggedIn: false
    });
};

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(422).render("auth/login", {
                pagetitle: "Login",
                isLoggedIn: false,
                errors: ["User does not exist"],
                oldInput: { email }
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(422).render("auth/login", {
                pagetitle: "Login",
                isLoggedIn: false,
                errors: ["Invalid Password"],
                oldInput: { email }
            });
        }

        req.session.isLoggedIn = true;
        req.session.user = {
            _id: String(user._id),
            email: user.email,
            role: user.role
        };
        req.session.save(err => {
            if (err) {
                console.log(err);
            }
            res.redirect("/");
        });

    } catch (err) {
        console.log(err);
        res.status(500).render("auth/login", {
            pagetitle: "Login",
            isLoggedIn: false,
            errors: ["Something went wrong"],
            oldInput: { email }
        });
    }
};

exports.postLogOut = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/login");
    })

}

exports.getSignUp = (req, res, next) => {
    res.render("auth/signup", {
        pagetitle: "signup"
    })
}



const { check, validationResult } = require("express-validator");

exports.postSignUp = [
    check("firstName")
        .trim()
        .isLength({ min: 2 })
        .withMessage("First Name should be at least 2 characters long")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("First Name should contain only alphabets"),

    check("lastName")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Last Name should be at least 2 characters long")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("Last Name should contain only alphabets"),

    check("email")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),

    check("password")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long"),

    check("confirmPassword")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),

    check("role")
        .isIn(["host", "guest"])
        .withMessage("Please select a valid role"),
    (req, res, next) => {
        console.log("Signup route hit");
        console.log(req.body);

        const { firstName, lastName, email, password, role } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation Errors:", errors.array());
            return res.status(422).render("/signup");
        }

        console.log("Validation Passed");

        bcrypt.hash(password, 12)
            .then(hashedPassword => {
                console.log("Password Hashed");

                const user = new User({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role
                });

                console.log("Saving User...");
                return user.save();
            })
            .then(result => {
                console.log("User Saved:", result);
                res.redirect("/login");
            })
            .catch(err => {
                console.log("ERROR:", err);
            });
    }
];