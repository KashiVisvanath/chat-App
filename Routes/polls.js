const express = require("express")
const router = express.Router();
const bcrypt = require("bcryptjs")
const passport = require("passport")

//passport config
require("../config/passport")(passport)

//user modal
const PollsModel = require("../modals/Polls");
const PollsStatus = require("../modals/PollsStatus");

function makeId(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
router.get('/create', async (req, res) => {

    req.body = {
        title: "Who will win then ICC WorldCup 2023",
        first: "India",
        second: "Pakistan",
        third: "Autralia",
        fourth: "Newzealand"
    };

    const id = makeId(6);

    const newOne = new PollsModel({
        title: req.body.title,
        first: {
            name: req.body.first,
            votes: 0
        },
        second: {
            name: req.body.second,
            votes: 0
        },
        third: {
            name: req.body.third,
            votes: 0
        },
        fourth: {
            name: req.body.fourth,
            votes: 0
        },
        pollId: id
    });
    await newOne.save();

    //res.redirect(`/polls/${id}`);
    res.send("poll created successfully");
});

router.get('/:id', async (req, res) => {
    const pollId = req.params.id;
    const poll = await PollsModel.findOne({ pollId: { $eq: pollId } });
    if (!poll) return res.render('notFound');

    res.render('vote', { poll: poll });
});

router.put('/vote', async (req, res) => {
    const pollId = req.query.pollId;
    const pollAnswer = req.query.pollAnswer;
    const emailId = req.user.email ;
    const found = await PollsModel.findOne({ pollId: { $eq: pollId } });
    
    let newOneToUpdate = {};

    switch (pollAnswer) {
        case "first":
            newOneToUpdate = {
                first: {
                    name: found.first.name,
                    votes: found.first.votes + 1,
                },
                second: {
                    name: found.second.name,
                    votes: found.second.votes
                },
                third: {
                    name: found.third.name,
                    votes: found.third.votes
                },
                fourth: {
                    name: found.fourth.name,
                    votes: found.fourth.votes
                }
            }
            break;
        case "second":
            newOneToUpdate = {
                first: {
                    name: found.first.name,
                    votes: found.first.votes,
                },
                second: {
                    name: found.second.name,
                    votes: found.second.votes + 1
                },
                third: {
                    name: found.third.name,
                    votes: found.third.votes
                },
                fourth: {
                    name: found.fourth.name,
                    votes: found.fourth.votes
                }
            }
            break;
        case "third":
            newOneToUpdate = {
                first: {
                    name: found.first.name,
                    votes: found.first.votes,
                },
                second: {
                    name: found.second.name,
                    votes: found.second.votes
                },
                third: {
                    name: found.third.name,
                    votes: found.third.votes + 1
                },
                fourth: {
                    name: found.fourth.name,
                    votes: found.fourth.votes
                }
            }
            break;
        case "fourth":
            newOneToUpdate = {
                first: {
                    name: found.first.name,
                    votes: found.first.votes,
                },
                second: {
                    name: found.second.name,
                    votes: found.second.votes
                },
                third: {
                    name: found.third.name,
                    votes: found.third.votes
                },
                fourth: {
                    name: found.fourth.name,
                    votes: found.fourth.votes + 1
                }
            }
            break;
        default: newOneToUpdate = {}
    };
     
    const pollStatusObj = {
       pollId : pollId,
       user_email : emailId,
       status : "Done"
    };
    const pollUpdated = await PollsStatus.updateOne({ user_email: emailId , pollId : pollId }, pollStatusObj, {
        upsert: true
    });
    
    const updated = await PollsModel.findByIdAndUpdate(found._id, newOneToUpdate, {
        new: true
    });

    res.send(updated);
});



module.exports = router;