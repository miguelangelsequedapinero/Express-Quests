const database = require("./database");

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};
// Login handlers
const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  const userEmail = req.body.email;
  database
    .query("select id, firstname, lastname, email, city, language, hashedPassword from users where email = ?", [userEmail])
    .then(([user]) => {
      if (user.toString() != "") {
        req.user = user;
        next();
      } else {
        res.status(401);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`This ${err} ocurred`);
    });
}

// Movie handlers
const getMovies = (req, res) => {
  let sql = "select * from movies";
  let sqlValues = [];
  req.query.color ? (sql += " where color = ?") && (sqlValues.unshift(req.query.color)) : null;
  req.query.max_duration ? (sql += " where duration <= ?") && (sqlValues.push(req.query.max_duration)) : null;
  req.query.color && req.query.max_duration ? (sql = "select * from movies where color = ? and duration <= ?") && (sqlValues.push(req.query.color, req.query.max_duration)) : null;

  database
    .query(sql, sqlValues)
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id = ?", [id])
    .then(([movie]) => {
      if (movie.toString() != "") {
        res.json(movie);
      } else {
        res.status(404).send("Not Found")
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`This ${err} ocurred`)
    });
};

const postMovies = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?,?,?,?,?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the data");
    });
};

const putMoviesById = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  const id = parseInt(req.params.id);

  database
    .query(
      "UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? where id = ?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if (result.affectedRows) {
        res.sendStatus(200);
      } else {
        res.status(404).send("ID not found")
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the data");
    });
};

const deleteMoviesById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query(
      "Delete from movies where id = ?", [id]
    )
    .then(([result]) => {
      if (result.affectedRows) {
        res.sendStatus(204);
      } else {
        res.status(404).send("ID not found")
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the data");
    });
};


// User handlers
const getUser = (req, res) => {
  let sql = "select id, firstname, lastname, email, city, language from users";
  let sqlValues = [];
  req.query.language ? (sql += " where language = ?") && (sqlValues.unshift(req.query.language)) : null;
  req.query.city ? (sql += " where city = ?") && (sqlValues.push(req.query.city)) : null;
  req.query.language && req.query.city ? (sql = "select * from users where language = ? and city = ?") && (sqlValues.push(req.query.language, req.query.city)) : null;

  database
    .query(sql, sqlValues)
    .then(([users]) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select firstname, lastname, email, city, language from users where id = ?", [id])
    .then(([user]) => {
      if (user.toString() != "") {
        res.status(200).json(user);
      } else {
        res.status(404).send("Not Found")
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`This ${err} ocurred`)
    });
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language, hashedPassword } = req.body;

  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword ) VALUES (?,?,?,?,?,?)",
      [firstname, lastname, email, city, language, hashedPassword]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the data");
    });
};

const putUserById = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
  const id = parseInt(req.params.id);

  database
    .query(
      "UPDATE users SET firstname = ?, lastname = ?, email = ? , city = ?, language = ? where id = ?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      if (result.affectedRows) {
        res.sendStatus(200);
      } else {
        res.status(404).send("ID not found")
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the data");
    });
};

const deleteUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query(
      "Delete from users where id = ?", [id]
    )
    .then(([result]) => {
      if (result.affectedRows) {
        res.sendStatus(204);
      } else {
        res.status(404).send("ID not found")
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the data");
    });
};

module.exports = {
  welcome,
  getUserByEmailWithPasswordAndPassToNext,
  getMovies,
  getMovieById,
  postMovies,
  putMoviesById,
  deleteMoviesById,
  getUser,
  getUserById,
  postUser,
  putUserById,
  deleteUserById
};
