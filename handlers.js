const database = require("./database");

const getMovies = (req, res) => {
  database
    .query("select * from movies")
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

const getUsers = (req, res) => {
  database
    .query("select * from users")
    .then(([users]) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("select * from users where id = ?", [id])
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

module.exports = {
  getMovies,
  getMovieById,
  getUsers,
  getUsersById
};
