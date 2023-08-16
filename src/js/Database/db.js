const mysql = require("mysql");
const path = require("path");
const bodyparser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
var cors = require("cors");
const morgan = require("morgan");
var fs = require("fs");
const bcrypt = require("bcrypt");
const generateToken = require("../middleware/generateToken");
const passwordResetMail = require("../middleware/passwordResetMail.js");
const passwordResetSuccessMail = require("../middleware/passwordResetSuccessMail.js");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

const projectenv = dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

var app = express();
app.use(morgan("combined")); //logs incoming requests
//app.use(bodyparser.json());
app.use(bodyparser.json({ limit: "10mb", extended: true }));
app.use(bodyparser.urlencoded({ limit: "10mb", extended: true }));
const { validationResult } = require("express-validator");


var connection = mysql.createConnection({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  dateStrings: true,
});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var connection = mysql.createConnection({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  dateStrings: true,
});

/*************Login Functionality code start **********/
// Method to verify token
app.post("/api/verifyToken", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  const token = req.body.accessToken;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.json({
        verify: false,
      });
    }
    res.status(200).json({
      verify: true,
    });
  });
});

// Post method to player login
app.post("/api/playerLogin", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  const { mobile_no, password } = req.body;

  connection.query(
    "select account_master.*, player_master.player_photo from account_master INNER JOIN player_master on account_master.account_id=player_master.account_id and account_master.mobile_no= ? and player_master.player_id=(select MIN(player_id) from player_master where mobile_no= ?)",
    [mobile_no, mobile_no],
    async (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        if (results.length > 0) {
          const matchedUserHashedPassword = results[0]["password"];
          const passwordValid = await bcrypt.compare(
            password,
            matchedUserHashedPassword
          );
          if (passwordValid && results[0]["approve_status"] === 1) {
            payload = {
              role: "player",
              account_id: results[0]["account_id"],
              email_id: results[0]["email_id"],
              first_name: results[0]["user_first_name"],
              photo: results[0]["player_photo"],
            };

            const accessToken = generateToken(payload);

            return res.json({
              accessToken: accessToken,
              message: "success",
            });
          } else if (passwordValid && results[0]["approve_status"] === 0) {
            results[0].role = "player";
            return res.json({
              message: "Pending",
            });
          } else if (!passwordValid) {
            return res.json({
              message: "pass_not_match",
            });
          }
        } else {
          return res.json({
            message: "user_not_found",
          });
        }
      }
    }
  );
});

// Post method to admin login
app.post("/api/adminLogin", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  var Credentials = {
    AUTHENTICATION: req.body.Credentials.AUTHENTICATION,
    ADMIN_EMAIL: req.body.Credentials.ADMIN_EMAIL,
    USER_ID: req.body.Credentials.USER_ID,
    ROLE: req.body.Credentials.ROLE,
    ADMIN_FIRSTNAME: req.body.Credentials.ADMIN_FIRSTNAME,
  };
  const { user_name, password } = req.body;
  if (Credentials.AUTHENTICATION == "OFF") {
    payload = {
      user_id: Credentials.USER_ID,
      role: Credentials.ROLE,
      email_id: Credentials.ADMIN_EMAIL,
      first_name: Credentials.ADMIN_FIRSTNAME,
    };
    const accessToken = generateToken(payload);
    return res.json({
      accessToken: accessToken,
      message: "super-admin",
    });
  }
  connection.query(
    "SELECT * FROM user_master WHERE user_name = ?",
    user_name,
    async (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        if (results.length > 0) {
          const matchedUserHashedPassword = results[0]["password"];
          const passwordValid = await bcrypt.compare(
            password,
            matchedUserHashedPassword
          );
          if (passwordValid && results[0]["approve_status"] === 1) {
            if (results[0]["user_group_id"] === 1) {
              var items = results[0].user_name.split(" ");
              var first_name = items[0];
              results[0].role = "super_admin";
              payload = {
                user_id: results[0]["user_id"],
                role: results[0]["role"],
                email_id: results[0]["email_id"],
                first_name: first_name,
              };
              const accessToken = generateToken(payload);
              return res.json({
                accessToken: accessToken,
                message: "super-admin",
              });
            } else if (results[0]["user_group_id"] === 2) {
              var items = results[0].user_name.split(" ");
              var first_name = items[0];
              results[0].role = "admin";
              payload = {
                user_id: results[0]["user_id"],
                role: results[0]["role"],
                email_id: results[0]["email_id"],
                first_name: first_name,
              };
              const accessToken = generateToken(payload);
              return res.json({
                accessToken: accessToken,
                message: "admin",
              });
            }
          } else if (!passwordValid) {
            return res.json({
              message: "pass_not_match",
            });
          } else if (passwordValid && results[0]["approve_status"] === 0) {
            return res.json({
              message: "Pending",
            });
          }
        } else {
          return res.json({
            message: "user_not_found",
          });
        }
      }
    }
  );
});

/**************Login Functionality code end******************/

// Post method to insert image
app.post("/addImage", (request, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  connection.connect(function (err) {
    console.log("Connected Image database!");

    var selectedImage = {
      image: request.body.nostalgic_gallery.image,
      image_name: request.body.nostalgic_gallery.imageName,
      tournament_year: request.body.nostalgic_gallery.tournamentYear,
    };
    connection.query(
      "INSERT INTO nostalgic_gallery SET ?",
      selectedImage,
      function (err, result) {
        if (err) {
          return res.send(err);
        } else {
          return res.send("Successfully added image ..");
        }
      }
    );
  });
});

app.get("/getImages", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  const SELECT_ALL_PRODUCTS_QUERY = "SELECT * FROM nostalgic_gallery";
  connection.query(SELECT_ALL_PRODUCTS_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results,
      });
    }
  });
});

app.post("/deleteImages", function (request, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  var deletedata = { image_id: request.body.nostalgic_gallery.image_id };
  connection.query(
    "DELETE FROM nostalgic_gallery where ?",
    deletedata,
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(process.env.API_PORT, () =>
  console.log("express server running on port " + process.env.API_PORT)
);

app.get("/", (req, res) => {
  res.send("Server Is Working");
});

//***database code for owner_login functionality start ***

//Get details of current login owner
app.get("/getCurrentOwner", (req, res) => {
  const { account_id } = req.query;
  connection.query(
    "SELECT * FROM account_master where account_id = ?",
    account_id,
    (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json({
          data: results,
        });
      }
    }
  );
});

//insert player data into player_master table
app.post("/playerRegister", (request, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  connection.connect(function (err) {
    var selectedPlayer = {
      account_id: request.body.playerReg.account_id,
      player_first_name: request.body.playerReg.first_name,
      player_last_name: request.body.playerReg.last_name,
      mobile_no: request.body.playerReg.mobile_no,
      birth_year: request.body.playerReg.birth_year,
      gender: request.body.playerReg.gender,
      update_date: request.body.playerReg.update_date,
      player_photo: request.body.playerReg.player_photo,
    };
    connection.query(
      "INSERT INTO player_master SET ?",
      selectedPlayer,
      function (err, result) {
        if (err) {
          return res.send(err);
        } else {
          return res.send("Successfully added player ..");
        }
      }
    );
  });
});

//select all players of account owner from player master table
app.get("/allPlayers", (req, res) => {
  const { account_id } = req.query;
  connection.query(
    "SELECT * FROM player_master where account_id = ?",
    account_id,
    (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json({
          data: results,
        });
      }
    }
  );
});

//Registered players data for display purpose
app.get("/getRegistrationData", (req, res) => {
  const { account_id, tournament_year } = req.query;
  connection.query(
    "SELECT * FROM players_registration_details inner join player_master on players_registration_details.player_id = player_master.player_id and player_master.account_id=? and players_registration_details.tournament_year=?",
    [account_id, tournament_year],
    (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json({
          data: results,
        });
      }
    }
  );
});

//Get category data for assign category to each player
app.get("/playerCategory", (req, res) => {
  const { category_gender, age } = req.query;
  connection.query("SELECT * FROM category_master", (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results,
      });
    }
  });
});

//update owner details in account_master table
app.get("/ownerUpdate", (req, res) => {
  connection.query(
    "UPDATE account_master SET user_first_name = ?, user_last_name = ?, phase_no = ?, building_no = ?, flat_no = ?, approve_status = ?, update_date = ? WHERE account_id = ?",
    [
      req.query.user_first_name,
      req.query.user_last_name,
      req.query.phase_no,
      req.query.building_no,
      req.query.flat_no,
      req.query.approve_status,
      req.query.update_date,
      req.query.account_id,
    ],
    (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send("Successfully updated");
      }
    }
  );
});

//Confirtm player registration for tournament
app.post("/confirmPlayerRegister", (request, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  connection.connect(function (err) {
    var selectedPlayer = {
      tournament_year: request.body.playerRegDetails.tournament_year,
      registration_date: request.body.playerRegDetails.registration_date,
      category_id: request.body.playerRegDetails.category_id,
      t_shirt_size: request.body.playerRegDetails.t_shirt_size,
      participation_fees: request.body.playerRegDetails.participation_fees,
      game_id: request.body.playerRegDetails.game_id,
      player_id: request.body.playerRegDetails.player_id,
      approve_status: request.body.playerRegDetails.approve_status,
      verify_date: request.body.playerRegDetails.verify_date,
      verify_by: request.body.playerRegDetails.verify_by,
      tournament_id: request.body.playerRegDetails.tournament_id,
    };
    console.log(selectedPlayer);
    connection.query(
      "INSERT INTO players_registration_details SET ?",
      selectedPlayer,
      function (err, result) {
        if (err) {
          console.log(err);
          return res.send(err);
        } else {
          return res.send("Successfully player Registered ..");
        }
      }
    );
  });
});

app.get("/ownerUpdateAtAdmin", (req, res) => {
  connection.query(
    "UPDATE player_master SET player_first_name = ?,player_last_name = ? WHERE account_id = ? and player_first_name = ? ",
    [
      req.query.user_first_name,
      req.query.user_last_name,
      req.query.account_id,
      req.query.player_first_name,
    ],
    (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send(result);
      }
    }
  );
});

app.get("/doCancelReg", (req, res) => {
  const { registration_id } = req.query;
  connection.query(
    "DELETE FROM players_registration_details WHERE registration_no = ?",
    registration_id,
    (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send("Successfully deleted ..");
      }
    }
  );
});

app.get("/doDeletePlayer", (req, res) => {
  const { player_id } = req.query;
  connection.query(
    "DELETE FROM player_master WHERE player_id = ?",
    player_id,
    (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send("Successfully deleted ..");
      }
    }
  );
});

app.get("/fetchTournament", (req, res) => {
  connection.query("select * from tournament_master", (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results,
      });
    }
  });
});

app.get("/getAccountMasterPlayerId", (req, res) => {
  const { account_id } = req.query;
  var player_id;
  connection.query(
    "select min(player_id) player_id from player_master where account_id=?",
    account_id,
    (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        results.map((result) => (player_id = result.player_id));
        return res.json({
          owner_player_id: player_id,
        });
      }
    }
  );
});

//***database code for owner_login functionality till this line ***

app.get("/admin/player", (req, res) => {
  connection.query(
    "Select registration_no,player_master.player_first_name,category_master.category_name,t_shirt_size,registration_date,verify_by,verify_date,approve_status " +
      "from players_registration_details " +
      "inner join player_master on players_registration_details.player_id=player_master.player_id " +
      "inner join category_master on players_registration_details.category_id=category_master.category_id",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.post("/admin/player", (req, res) => {
  const { registration_no, verify_by } = req.query;
  connection.query(
    "UPDATE players_registration_details SET approve_status = '1', verify_date = CURRENT_TIMESTAMP(), verify_by = " +
    mysql.escape(verify_by) +
    " WHERE registration_no = " +
    mysql.escape(registration_no),
    (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        const updateResult = result;
        connection.query("Select category_id from players_registration_details" +
          " WHERE registration_no = " +
          mysql.escape(registration_no),
          (err, results) => {
            if (err) {
              return res.send(err);
            } else {
              const jsonCategory = JSON.stringify(results);
              const jsonCategoryParsed = JSON.parse(jsonCategory);
              const registered_category_id = jsonCategoryParsed[0].category_id;
              connection.query("update team_players set registered_players = registered_players + 1" +
                " WHERE category_id = " +
                mysql.escape(registered_category_id),
                (err, results) => {
                  if (err) {
                    return res.send(err);
                  } else {
                    return res.json({
                      data: updateResult,
                    });
                  }
                })
            }
          })
      }
    }
  );
});

app.get("/admin/category", (req, res) => {
  connection.query(
    "SELECT * FROM category_master",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.get("/admin/category/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM category_master where category_name=" + mysql.escape(id),
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.delete("/admin/category", function (req, res) {
  const { ids } = req.query;
  connection.query(
    "DELETE FROM category_master where category_name=" + mysql.escape(ids),
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.post("/admin/category", (req, res, next) => {
  const {
    category_name,
    category_gender,
    min_age,
    max_age,
    participation_fees,
    sponsorship_amount,
    is_active,
  } = req.body.data;
  connection.query(
    "INSERT INTO category_master (category_name,category_gender,min_age,max_age,participation_fees,sponsorship_amount,is_active,update_date) values(" +
      mysql.escape(category_name) +
      "," +
      mysql.escape(category_gender) +
      "," +
      mysql.escape(min_age) +
      "," +
      mysql.escape(max_age) +
      "," +
      mysql.escape(participation_fees) +
      "," +
      mysql.escape(sponsorship_amount) +
      "," +
      mysql.escape(is_active) +
      ",CURRENT_TIMESTAMP())",
    function (error, result, fields) {
      if (error) throw error;
      res.send(result);
    }
  );
});

app.put("/admin/category/:id", (req, res) => {
  const {
    category_id,
    category_name,
    category_gender,
    min_age,
    max_age,
    participation_fees,
    sponsorship_amount,
    is_active,
  } = req.body.data;
  connection.query(
    "UPDATE category_master SET category_name=" +
      mysql.escape(category_name) +
      ", category_gender=" +
      mysql.escape(category_gender) +
      ", max_age=" +
      mysql.escape(max_age) +
      ", min_age=" +
      mysql.escape(min_age) +
      ", participation_fees=" +
      mysql.escape(participation_fees) +
      ", sponsorship_amount=" +
      mysql.escape(sponsorship_amount) +
      ", is_active=" +
      mysql.escape(is_active) +
      " WHERE category_id =" +
      mysql.escape(category_id),

    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.get("/admin/team", (req, res) => {
  connection.query(
    "SELECT category_name,team_category,team_name,team_short_name,sponsor_email_id,sponsor_player FROM team_master, category_master WHERE category_master.category_id = team_master.team_category",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.get("/admin/team/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM team_master where team_name=" + mysql.escape(id),
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.delete("/admin/team", function (req, res) {
  const { ids } = req.query;
  connection.query(
    "DELETE FROM team_master where team_name=" + mysql.escape(ids),
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.post("/admin/team", (req, res, next) => {
  const {
    team_category,
    team_name,
    team_short_name,
    sponsor_email_id,
    sponsor_player,
  } = req.body;
  connection.query(
    "INSERT INTO team_master (team_category,team_name,team_short_name,sponsor_email_id,sponsor_player) values(" +
      mysql.escape(team_category) +
      "," +
      mysql.escape(team_name) +
      "," +
      mysql.escape(team_short_name) +
      "," +
      mysql.escape(sponsor_email_id) +
      "," +
      mysql.escape(sponsor_player) +
      ")",
    function (error, result, fields) {
      if (error) throw error;
      res.send(result);
    }
  );
});

app.put("/admin/team/:id", (req, res) => {
  const {
    team_id,
    team_category,
    team_name,
    team_short_name,
    sponsor_email_id,
    sponsor_player,
  } = req.body.data;
  connection.query(
    "UPDATE team_master SET team_category=" +
      mysql.escape(team_category) +
      ", team_name=" +
      mysql.escape(team_name) +
      ", team_short_name=" +
      mysql.escape(team_short_name) +
      ", sponsor_email_id=" +
      mysql.escape(sponsor_email_id) +
      ", sponsor_player=" +
      mysql.escape(sponsor_player) +
      " WHERE team_id=" +
      mysql.escape(team_id),
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.get("/api/alreadyTeamPresent", function (req, res) {
  connection.query(
    "SELECT team_name, team_short_name FROM team_master",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.get("/admin/account", (req, res) => {
  connection.query(
    "SELECT CONCAT_WS(' ', `user_first_name`, `user_last_name`) AS `name`, " +
      "phase_no,building_no,flat_no,owner,email_id,birth_year,verify_by,verify_date, " +
      "approve_status,update_date,is_active,mobile_no,account_id " +
      "FROM account_master",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.get("/api/getAllCategoriesIDWithName", (req, res) => {
  connection.query(
    "SELECT category_id, category_name FROM category_master",
    function (err, results, fields) {
      if (err) throw err;
      const team_category = [];
      {
        results.map((result) =>
          team_category.push({
            value: result.category_id,
            label: result.category_name,
          })
        );
      }
      res.send(team_category);
    }
  );
});

app.get("/api/getAllSponsorsEmail", (req, res) => {
  connection.query(
    "SELECT email_id FROM sponsors_master",
    function (err, results, fields) {
      if (err) throw err;
      const sponsors_emails = [];
      {
        results.map((result) =>
          sponsors_emails.push({
            value: result.email_id,
            label: result.email_id,
          })
        );
      }
      res.send(sponsors_emails);
    }
  );
});

app.post("/admin/account", (req, res) => {
  const { account_id, verify_by } = req.query;
  connection.query(
    "UPDATE account_master SET approve_status = '1', verify_date = CURRENT_TIMESTAMP(), verify_by = " +
      mysql.escape(verify_by) +
      "WHERE account_id = " +
      mysql.escape(account_id),
    (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json({
          data: results,
        });
      }
    }
  );
});

/***************Owner Registration details start****************/
//Method to add owner account
app.get("/account/add", async (req, res) => {
  const {
    mobile_no,
    password,
    user_first_name,
    user_last_name,
    phase_no,
    building_no,
    flat_no,
    owner,
    email_id,
    birth_year,
    update_date,
    gender,
  } = req.query;
  let saltRounds = 10;
  const HashPassword = await bcrypt.hash(password, saltRounds);
  const values = [
    [
      mobile_no,
      HashPassword,
      user_first_name,
      user_last_name,
      phase_no,
      building_no,
      flat_no,
      owner,
      email_id,
      birth_year,
      update_date,
      gender,
    ],
  ];

  connection.query(
    "INSERT INTO account_master(mobile_no,password,user_first_name,user_last_name,phase_no,building_no,flat_no,owner,email_id,birth_year,update_date,gender) VALUES ?",
    [values],
    function (err, results) {
      if (err) {
        res.send(err);
      } else {
        return res.json({
          message: "Success",
          account_id: results.insertId,
        });
      }
    }
  );
});

//Method to get all account details
app.get("/account/show", (req, res) => {
  connection.query(
    "select * from account_master ",
    function (error, results, fields) {
      if (!error) res.send(results);
      else res.send(error);
    }
  );
});

//Method to get all Email
app.get("/email", function (req, res) {
  connection.query(
    "select email_id from account_master",
    function (error, results, fields) {
      if (error) {
        return res.send(error);
      } else {
        return res.json({
          data: results,
        });
      }
    }
  );
});

//Method to get all Mobile No

app.get("/mobile", function (req, res) {
  connection.query(
    "select mobile_no from account_master",
    function (error, results, fields) {
      if (error) {
        return res.send(error);
      } else {
        return res.json({
          data: results,
        });
      }
    }
  );
});
/***************Owner Registration Details Ends****************/

/************* Reset Password Functionality Code ******************/
app.post("/api/alreadyPresent", function (req, res) {
  const { email_id, role } = req.body;
  if (role === "admin") {
    connection.query(
      "select email_id from user_master where email_id = " +
        mysql.escape(email_id),
      function (error, results, fields) {
        if (error) {
          return res.send(error);
        } else {
          if (results.length > 0) {
            return res.json({
              present: true,
            });
          } else {
            return res.json({
              present: false,
            });
          }
        }
      }
    );
  } else if (role === "player") {
    connection.query(
      "select email_id from account_master where email_id = " +
        mysql.escape(email_id),
      function (error, results, fields) {
        if (error) {
          return res.send(error);
        } else {
          if (results.length > 0) {
            return res.json({
              present: true,
            });
          } else {
            return res.json({
              present: false,
            });
          }
        }
      }
    );
  }
});

app.post("/api/forget-password", function (req, res) {
  const { email_id, role } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    if (role === "admin") {
      connection.query(
        "select email_id from user_master where email_id = " +
          mysql.escape(email_id),
        function (error, results, fields) {
          const token = jwt.sign(
            {
              user_id: results[0]["user_id"],
              role: role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "10m",
            }
          );

          connection.query(
            "update user_master set reset_password_token = " +
              mysql.escape(token) +
              "where email_id = " +
              mysql.escape(email_id),
            function (error, results, fields) {
              if (error) {
                console.log("RESET PASSWORD LINK ERROR", error);
                return res.status(400).json({
                  error:
                    "Database connection error on user password forgot request",
                });
              } else {
                const PasswordResetLink =
                  process.env.CLIENT_URL +
                  "/admin-reset/token?token=" +
                  token +
                  "&role=" +
                  role;
                passwordResetMail(email_id, PasswordResetLink, token, res);
              }
            }
          );
        }
      );
    } else if (role === "player") {
      connection.query(
        "select email_id from account_master where email_id = " +
          mysql.escape(email_id),
        function (error, results, fields) {
          const token = jwt.sign(
            {
              account_id: results[0]["account_id"],
              role: role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "10m",
            }
          );

          connection.query(
            "update account_master set reset_password_token = " +
              mysql.escape(token) +
              "where email_id = " +
              mysql.escape(email_id),
            function (error, results, fields) {
              if (error) {
                console.log("RESET PASSWORD LINK ERROR", error);
                return res.status(400).json({
                  error:
                    "Database connection error on user password forgot request",
                });
              } else {
                const PasswordResetLink =
                  process.env.CLIENT_URL +
                  "/player-reset/token?token=" +
                  token +
                  "&role=" +
                  role;
                passwordResetMail(email_id, PasswordResetLink, token, res);
              }
            }
          );
        }
      );
    }
  }
});

app.post("/api/reset-password", async (req, res) => {
  const { resetPasswordLink, newPassword, role } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(
        resetPasswordLink,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, decoded) {
          if (err) {
            return res.status(400).json({
              error: "Expired link. Try again",
            });
          }

          if (role === "admin") {
            let email_id = "";
            connection.query(
              "select user_id, email_id from user_master where reset_password_token = " +
                mysql.escape(resetPasswordLink),
              async function (error, results, fields) {
                if (error || !results.length) {
                  return res.status(400).json({
                    error: "Something went wrong. Try later 1",
                  });
                } else {
                  email_id = results[0].email_id;
                  let saltRounds = 10;
                  const HashPassword = await bcrypt.hash(
                    newPassword,
                    saltRounds
                  );
                  connection.query(
                    "update user_master set password = " +
                      mysql.escape(HashPassword) +
                      ", reset_password_token = " +
                      mysql.escape(null) +
                      " where user_id = " +
                      mysql.escape(results[0].user_id),
                    function (error, results, fields) {
                      if (error) {
                        return res.status(400).json({
                          error: "Something went wrong. Try later 2",
                        });
                      }
                      passwordResetSuccessMail(email_id, res);
                    }
                  );
                }
              }
            );
          } else if (role === "player") {
            let email_id = "";
            connection.query(
              "select account_id, email_id from account_master where reset_password_token = " +
                mysql.escape(resetPasswordLink),
              async function (error, results, fields) {
                if (error || !results.length) {
                  return res.status(400).json({
                    error: "Something went wrong. Try later 1",
                  });
                } else {
                  email_id = results[0].email_id;
                  let saltRounds = 10;
                  const HashPassword = await bcrypt.hash(
                    newPassword,
                    saltRounds
                  );
                  connection.query(
                    "update account_master set password = " +
                      mysql.escape(HashPassword) +
                      ", reset_password_token = " +
                      mysql.escape(null) +
                      " where account_id = " +
                      mysql.escape(results[0].account_id),
                    function (error, results, fields) {
                      if (error) {
                        return res.status(400).json({
                          error: "Something went wrong. Try later 2",
                        });
                      }
                      passwordResetSuccessMail(email_id, res);
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  }
});

/************* Reset Password Functionality Code ******************/
app.get("/admin/sponsor", (req, res) => {
  connection.query(
    "SELECT * FROM sponsors_master",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

/***************Admin Registration Details Ends****************/
//Method to add admin account
app.get("/adminReg", async (req, res) => {
  const {
    user_name,
    password,
    user_group_id,
    email_id,
    phone_no,
    approve_status,
  } = req.query;
  let saltRounds = 10;
  const HashPassword = await bcrypt.hash(password, saltRounds);
  const values = [
    [
      user_name,
      HashPassword,
      user_group_id,
      email_id,
      phone_no,
      approve_status,
    ],
  ];
  connection.query(
    "INSERT INTO user_master(user_name,password,user_group_id,email_id,phone_no,approve_status) VALUES ?",
    [values],
    function (err, results) {
      if (err) {
        res.send(err);
      } else {
        return res.json({
          message: "Success",
        });
      }
    }
  );
});

//Method to get all account details
app.get("/adminReg/show", (req, res) => {
  connection.query(
    "select * from user_master ",
    function (error, results, fields) {
      if (!error) res.send(results);
      else res.send(error);
    }
  );
});
//Method to get all Email
app.get("/adminEmail", function (req, res) {
  connection.query(
    "select email_id from user_master",
    function (error, results, fields) {
      if (error) {
        return res.send(error);
      } else {
        return res.json({
          data: results,
        });
      }
    }
  );
});

//Method to get all Phone No
app.get("/adminPhone", function (req, res) {
  connection.query(
    "select phone_no from user_master",
    function (error, results, fields) {
      if (error) {
        return res.send(error);
      } else {
        return res.json({
          data: results,
        });
      }
    }
  );
});

//Method to get all User Name
app.get("/adminUserName", function (req, res) {
  connection.query(
    "select user_name from user_master",
    function (error, results, fields) {
      if (error) {
        return res.send(error);
      } else {
        return res.json({
          data: results,
        });
      }
    }
  );
});

// Post method to check if user_master is empty or not
app.post("/api/adminAll", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  connection.query(
    "select * from user_master",
    function (error, results, fields) {
      if (error || results.length == 0) {
        return res.json({
          message: "Empty",
        });
      } else {
        return res.json({
          message: "Data",
        });
      }
    }
  );
});

/***************Admin Registration Details Ends****************/

/***************Admin Authentication Details Starts****************/
app.get("/admin/auth", (req, res) => {
  connection.query("SELECT * FROM user_master", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/admin/sponsor", (req, res) => {
  const {
    sponsor_name,
    sponsor_short_name,
    sponsor_description,
    contact_no,
    email_id,
    website,
    gcpl_accociation_from,
    owner,
    agc_residence_year_from,
    is_active,
    update_date,
    sponsorship_amount,
  } = req.body;
  connection.query(
    "INSERT INTO sponsors_master (sponsor_name,sponsor_short_name,sponsor_description,contact_no,email_id,website,gcpl_accociation_from,owner,agc_residence_year_from,is_active,update_date,sponsorship_amount) values(" +
      mysql.escape(sponsor_name) +
      ", " +
      mysql.escape(sponsor_short_name) +
      ", " +
      mysql.escape(sponsor_description) +
      ", " +
      mysql.escape(contact_no) +
      ", " +
      mysql.escape(email_id) +
      ", " +
      mysql.escape(website) +
      ", " +
      mysql.escape(gcpl_accociation_from) +
      ", " +
      mysql.escape(owner) +
      ", " +
      mysql.escape(agc_residence_year_from) +
      ", " +
      mysql.escape(is_active) +
      ", CURRENT_TIMESTAMP(), " +
      mysql.escape(sponsorship_amount) +
      ")",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.get("/admin/sponsor/new", (req, res) => {
  connection.query(
    "SELECT email_id FROM sponsors_master",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.put("/admin/sponsor", (req, res) => {
  const {
    sponsor_name,
    sponsor_short_name,
    sponsor_description,
    contact_no,
    email_id,
    website,
    owner,
    is_active,
    sponsorship_amount,
    gcpl_accociation_from,
    agc_residence_year_from,
  } = req.body.data;
  connection.query(
    "UPDATE sponsors_master SET sponsor_name=?, sponsor_short_name=?, sponsor_description=?, contact_no=?, website=?, owner=?, is_active=?, sponsorship_amount=?, gcpl_accociation_from=?, agc_residence_year_from=? WHERE email_id=?",
    [
      sponsor_name,
      sponsor_short_name,
      sponsor_description,
      contact_no,
      website,
      owner,
      is_active,
      sponsorship_amount,
      gcpl_accociation_from,
      agc_residence_year_from,
      email_id,
    ],
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.delete("/admin/sponsor", (req, res) => {
  const { ids } = req.query;
  connection.query(
    "Delete from sponsors_master WHERE email_id=" + mysql.escape(ids),
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.get("/admin/sponsor/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM sponsors_master where email_id=" + mysql.escape(id),
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.post("/admin/authStatus", (req, res) => {
  const { user_id } = req.query;
  connection.query(
    'UPDATE user_master SET approve_status = "1" WHERE user_id =' +
      mysql.escape(user_id),
    (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json({
          data: results,
        });
      }
    }
  );
});

app.post("/admin/authRole", (req, res) => {
  const { user_id } = req.query;
  connection.query(
    'UPDATE user_master SET user_group_id = "1" WHERE user_id =' +
      mysql.escape(user_id),
    (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.json({
          data: results,
        });
      }
    }
  );
});

/***************Admin Authentication Details Ends****************/

/************************ Tournament ************************************/
app.get("/admin/tournament", (req, res) => {
  connection.query(
    "SELECT * FROM tournament_master ORDER BY tournament_id DESC",
    (error, result, fields) => {
      if (error) throw error;
      res.send(result);
    }
  );
});

app.post("/admin/tournament/create", (req, res) => {
  const { tournament_name, tournament_desc, StartDate, EndDate } = req.body;
  connection.query(
    "INSERT INTO tournament_master (tournament_name,tournament_desc,StartDate,EndDate) values(" +
      mysql.escape(tournament_name) +
      "," +
      mysql.escape(tournament_desc) +
      ",str_to_date(" +
      mysql.escape(StartDate) +
      ", '%Y-%m-%d'),str_to_date(" +
      mysql.escape(EndDate) +
      ", '%Y-%m-%d'))",
    (error, result, fields) => {
      if (error) throw error;
      res.send(result);
    }
  );
});
app.get("/admin/tournament/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM tournament_master where tournament_id=" + mysql.escape(id),
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.delete("/admin/tournament", function (req, res) {
  const { ids } = req.query;
  connection.query(
    "DELETE FROM tournament_master where tournament_id=" + mysql.escape(ids),
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.put("/admin/tournament", (req, res) => {
  const {
    tournament_id,
    tournament_name,
    tournament_desc,
    StartDate,
    EndDate,
  } = req.body.data;
  connection.query(
    "UPDATE tournament_master SET tournament_name=" +
      mysql.escape(tournament_name) +
      ", tournament_desc=" +
      mysql.escape(tournament_desc) +
      ", StartDate = str_to_date(LEFT(" +
      mysql.escape(StartDate) +
      ",10), '%Y-%m-%d'), EndDate = str_to_date(LEFT(" +
      mysql.escape(EndDate) +
      ",10), '%Y-%m-%d') WHERE tournament_id =" +
      mysql.escape(tournament_id),
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

/************************ Tournament ************************************/
app.get("/getTournament", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  const SELECT_ALL_PRODUCTS_QUERY = "SELECT * FROM tournament_master";
  connection.query(SELECT_ALL_PRODUCTS_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results,
      });
    }
  });
});

/********************  Dynamic TimeTable  ***********************/
app.get("/getTeamName", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  const Select_team_name = "Select team_name from team_master";
  connection.query(Select_team_name, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/getTournamentIdName", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  const tournamentIdName =
    "Select tournament_id, StartDate, EndDate, tournament_name from tournament_master";
  connection.query(tournamentIdName, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/admin/schedule", (req, res) => {
  const {
    tournament_name,
    match_date,
    first_team,
    second_team,
    match_time,
    match_venue,
  } = req.body;
  connection.query(
    "Select tournament_id from tournament_master where tournament_name = " +
      mysql.escape(tournament_name),
    (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        var id = json[0].tournament_id;
        connection.query(
          "INSERT INTO match_details (tournament_id, match_date, first_team, second_team, match_time, match_venue) values(" +
            mysql.escape(id) +
            ",str_to_date(LEFT(" +
            mysql.escape(match_date) +
            ",10), '%d-%m-%Y')," +
            mysql.escape(first_team) +
            "," +
            mysql.escape(second_team) +
            "," +
            mysql.escape(match_time) +
            "," +
            mysql.escape(match_venue) +
            ")",
          function (error, result) {
            if (error) throw error;
            res.send(result);
          }
        );
      }
    }
  );
});

app.get("/getMatchDetails", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  const SELECT_ALL_PRODUCTS_QUERY =
    "Select match_id, tournament_master.tournament_name, match_details.match_date, match_details.first_team, match_details.second_team, match_details.match_time, match_details.match_venue from match_details INNER JOIN tournament_master ON match_details.tournament_id=tournament_master.tournament_id";
  connection.query(SELECT_ALL_PRODUCTS_QUERY, (err, result) => {
    if (err) {
     
      //  return res.send(err,{message:"Error in getMatchDetails function call"});
      return res.json({
        // data2:err,
        message:"Error in getMatchDetails function call",
      });
    } else {
      return res.json({
        data: result,
      });
    }
  });
});

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function GetSortOrder(select) {
  return function (a, b) {
    const propA = select(a);
    const propB = select(b);
    if (propA < propB) {
      return 1;
    } else if (propA > propB) {
      return -1;
    }
    return 0;
  };
}

//*******************Stepwise team creation******************
app.get("/admin/stepwiseteamCreation", (req, res) => {
  connection.query(
    "set global sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION'",
    (err, results) => {
      connection.query("select * from category_master", (err, results) => {
        if (err) {
          return res.send(err);
        } else {
          const playersData = [];
          const allCategories = results;
          connection.query("select distinct category_id from players_registration_details", (err, results) => {
            if (err) {
              return res.send(err);
            } else {
              const jsonData = JSON.stringify(results);
              const categoriesOfRegistredPlayers = JSON.parse(jsonData);
              connection.query(
                "select k.player_id,player_photo, mobile_no, player_first_name, player_last_name, birth_year,runs, wickets,gender, year, overs, not_out from player_stats as k inner join player_master as p ON k.player_id = p.player_id inner join players_registration_details as m on m.player_id = p.player_id ",
                (err, results) => {
                  if (err) {
                    return res.send(err);
                  } else {
                    const categories = [];
                    results.map((result) => {
                      const balls_faced = result.overs * 6;
                      const batting_strike_rate = (result.runs * 100) / balls_faced;
                      const bowling_strike_rate = result.runs / result.wickets;
                      var batting_avg = result.runs / result.not_out;
                      batting_avg = batting_avg == 0 ? batting_avg : result.runs;
                      result.player_full_name = result.player_first_name + " " + result.player_last_name;
                      result.batting_strike_rate = batting_strike_rate;
                      result.bowling_strike_rate = bowling_strike_rate;
                      result.batting_avg = batting_avg;
                      var currentYear = new Date().getFullYear();
                      var age = currentYear - parseInt(result.birth_year);
                      result.age = age;
                      allCategories.map((category) => {
                        if (
                          categoriesOfRegistredPlayers.category_id == category.category_id ||
                          category.category_gender == result.gender &&
                          age >= category.min_age &&
                          age <= category.max_age &&
                          category.is_active == 1
                        ) {
                          result.category = category.category_name;
                          categories.push(category.category_name);
                        }
                      });
                    });
                    allCategories.map((category) => {
                      categoriesOfRegistredPlayers.map((row)=>{
                        if(category.category_id === row.category_id){
                          categories.push(category.category_name)
                        }
                      })
                    })

                    results.sort(
                      GetSortOrder(function (i) {
                        return i.batting_strike_rate;
                      })
                    );
                    results.map((row) => {
                      playersData.push(row);
                    })
                    var unique = categories.filter(onlyUnique);
                    connection.query(
                      "select A.player_id, player_photo ,mobile_no,A.tournament_year, A.category_id, B.player_first_name, B.player_last_name, B.birth_year from players_registration_details as A natural join player_master as B where A.approve_status=1 and player_id not IN (select player_id from players_registration_details natural join player_master natural join player_stats)",
                      (err, debutePlayer) => {
                        if (err) {
                          return res.send(err);
                        }
                        else {
                          connection.query(
                            "select distinct(category_name), category_id from category_master as cm natural join team_master as tm where cm.category_id=tm.team_category",
                            (err, final_result) => {
                              if (err) {
                                return res.send(err);
                              }
                              else {
                                debutePlayer.map((row) => {
                                  row.player_full_name = row.player_first_name + " " + row.player_last_name;
                                  var currentYear = new Date().getFullYear();
                                  var age = currentYear - parseInt(row.birth_year);
                                  row.age = age;
                                  row.role = "Debutant";
                                  row.rank = "0";
                                  row.runs = "0";
                                  row.overs = "0";
                                  row.wickets = "0";
                                  row.total_wickets = "#";
                                  row.total_runs = "#";
                                  row.total_overs = "#";
                                  row.batting_strike_rate = 0.00;
                                  row.bowling_strike_rate = 0.00;
                                  row.batting_avg = 0.00;
                                  row.year = row.tournament_year;
                                  allCategories.map((category) => {
                                    if (category.category_id === row.category_id) {
                                      row.category = category.category_name;
                                    }
                                  })
                                })
                                debutePlayer.map((row) => {
                                  playersData.push(row);
                                })
                                var groupByCategoryDebute = groupBy(playersData, "category");
                                const debut = groupByCategoryDebute;
                                return res.json({
                                  data: debut,
                                  categories: unique,
                                  finalcategoryid: final_result,
                                });

                              }
                            }
                          )
                        }
                      }
                    );
                  }
                }
              )
            }
          }
          );
        }
      }
      );
    }
  );
});

app.get("/admin/teamfetch", (req, res) => {
  connection.query(
    "SELECT category_name,team_name FROM team_master, category_master WHERE category_master.category_id = team_master.team_category ",
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.post('/admin/teamFormation', (req, res) => {
  const { team_length, registered_players, selected_category, buffer_player, total_team, category_id, already_created_teams } = req.body;
  connection.query(
    "INSERT INTO team_players (category_name,category_id,team_length,registered_players,total_buffer_players,total_teams_admin,already_created_teams) values(" +
    mysql.escape(selected_category) +
    "," +
    mysql.escape(category_id) +
    "," +
    mysql.escape(team_length) +
    "," +
    mysql.escape(registered_players) +
    "," +
    mysql.escape(buffer_player) +
    "," +
    mysql.escape(total_team) +
    "," +
    mysql.escape(already_created_teams) +
    ")",
    (error, result) => {
      if (error) throw error;
      res.send(result);
    }
  );

});

app.get("/admin/getdataofteams", (req, res) => {
  const teamplayerData = "SELECT * FROM team_players";
  connection.query(teamplayerData, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results,
      });
    }
  });
});


app.post("/admin/schedule/update", (req, res) => {
  const {
    match_id,
    match_date,
    tournament_name,
    first_team,
    second_team,
    match_time,
    match_venue,
  } = req.body;
  connection.query(
    "Select tournament_id from tournament_master where tournament_name = " +
      mysql.escape(tournament_name),
    (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        var tournament_id = json[0].tournament_id;
        connection.query(
          "UPDATE match_details SET tournament_id =" +
          mysql.escape(tournament_id) +
          ", match_date = "+
          mysql.escape(match_date) +
          ", first_team = " +
          mysql.escape(first_team) +
          ",second_team = " +
          mysql.escape(second_team) +
          ",match_time =" +
          mysql.escape(match_time) +
          ", match_venue =" +
          mysql.escape(match_venue) +
          "WHERE match_id ="+
          mysql.escape(match_id),
          (err, result) => {
            if (err) {
              return res.send(err);
            } else {
              return res.send("Successfully updated");
            }
          }
        );
      }
    });
});

app.delete("/admin/schedule/delete/:id", (req, res) => {
  const { id } = req.body;
  connection.query(
    "Delete from match_details where match_id= ? ", [id],
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});
/********************  Dynamic TimeTable  ***********************/

app.post("/admin/teamdata/delete", function (req, res) {
  const { category_name } = req.query;
  connection.query(
    "DELETE FROM team_players where category_name=" + mysql.escape(category_name),
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.post('/admin/update/teamdata', (req, res) => {
  const team_length = req.body.team_length;
  const registered_players = req.body.registered_players;
  const buffer_player = req.body.buffer_player;
  const selected_category = req.body.selected_category;
  const total_team = req.body.total_team;
  const already_created_teams = req.body.already_created_teams
  connection.query("UPDATE team_players set team_length=?,registered_players=?,total_buffer_players=?,total_teams_admin=?,already_created_teams=? WHERE category_name=?",
    [team_length, registered_players, buffer_player, total_team, already_created_teams, selected_category],
    (err, result) => {
      if (err) {
        throw err;
      }
      else {
        res.send(result);
      }
    })
});

app.get("/getTimetable", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  const SELECT_ALL_PRODUCTS_QUERY =
    "Select match_id, tournament_master.tournament_name, match_details.match_date, match_details.first_team, match_details.second_team, match_details.match_time, match_details.match_venue from match_details INNER JOIN tournament_master ON match_details.tournament_id=tournament_master.tournament_id";
  connection.query(SELECT_ALL_PRODUCTS_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results,
      });
    }
  });
});

app.get("/getTournament", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");
  const SELECT_ALL_PRODUCTS_QUERY = "SELECT * FROM tournament_master";
  connection.query(SELECT_ALL_PRODUCTS_QUERY, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.json({
        data: results,
      });
    }
  });
});

