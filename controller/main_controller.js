const { Parser } = require("json2csv");
const path = require("path");
const csv = require("csvtojson");
const fs = require("fs");
let ans = [];

exports.root = (req, res) => {
  res.render("home", {});
};

exports.magazines = async (req, res) => {
  ans = [];
  (
    await csv({
      delimiter: ";",
    }).fromFile(path.join(__dirname, "../utils/magazines.csv"))
  ).forEach((mag) => {
    mag.authors = mag.authors.split(",");
    ans.push(mag);
  });
  res.render("magazines", {
    data: ans,
  });
};

exports.books = async (req, res) => {
  ans = [];
  (
    await csv({
      delimiter: ";",
    }).fromFile(path.join(__dirname, "../utils/books.csv"))
  ).forEach((book) => {
    ans.push(book);
  });
  res.render("books", {
    data: ans,
  });
};
exports.authors = async (req, res) => {
  ans = [];

  (
    await csv({
      delimiter: ";",
    }).fromFile(path.join(__dirname, "../utils/authors.csv"))
  ).forEach((author) => {
    ans.push(author);
  });
  res.render("authors", {
    data: ans,
  });
};

exports.addto = (req, res) => {
  res.render("select_field");
};

exports.add = (req, res) => {
  let type = req.params.id;
  console.log(type);
  res.render("addtocsv", {
    display: type,
  });
};

exports.addData = async (req, res) => {
  let type = req.params.id;
  let fields, opts;
  if (type == "books") {
    ans = [];
    (
      await csv({
        delimiter: ";",
      }).fromFile(path.join(__dirname, "../utils/books.csv"))
    ).forEach((book) => {
      ans.push(book);
    });
    const obj = JSON.parse(JSON.stringify(req.body));
    ans.push(obj);
    fields = ["title", "isbn", "author", "description"];
    opts = { fields, delimiter: ";" };
  } else if (type == "authors") {
    ans = [];
    (
      await csv({
        delimiter: ";",
      }).fromFile(path.join(__dirname, "../utils/authors.csv"))
    ).forEach((book) => {
      ans.push(book);
    });
    const obj = JSON.parse(JSON.stringify(req.body));
    ans.push(obj);
    fields = ["email", "firstname", "lastname"];
    opts = { fields, delimiter: ";" };
  } else {
    ans = [];
    (
      await csv({
        delimiter: ";",
      }).fromFile(path.join(__dirname, "../utils/magazines.csv"))
    ).forEach((book) => {
      ans.push(book);
    });
    const obj = JSON.parse(JSON.stringify(req.body));
    ans.push(obj);
    fields = ["title", "isbn", "author", "publishedAt"];
    opts = { fields, delimiter: ";" };
  }
  try {
    const parser = new Parser(opts);
    const csv = parser.parse(ans);
    fs.writeFileSync(path.join(__dirname, `../utils/${type}.csv`), csv);
  } catch (err) {
    console.error(err);
  }
  res.render(type, {
    data: ans,
  });
};

exports.sauth = (req, res) => {
  if (req.body.field === "email") {
    let text = req.body.text.toLowerCase();
    switch (`${req.body.type}`) {
      case "books":
        if (text != "") {
          console.log(ans);
          let updated = ans.filter((a) =>
            a.authors.toLowerCase().includes(text)
          );
          res.render(`${req.body.type}`, {
            data: updated,
          });
        }
        break;
      case "magazines":
        if (text != "") {
          let updated = ans.filter((a) =>
            a.authors.some((e) => e.toLowerCase().includes(text))
          );
          res.render(`${req.body.type}`, {
            data: updated,
          });
        }
        break;
      case "authors":
        if (text != "") {
          let updated = ans.filter((a) => a.email.toLowerCase().includes(text));
          res.render(`${req.body.type}`, {
            data: updated,
          });
        }
        break;
    }
  } else if (req.body.field === "isbn") {
    let text = req.body.text.toLowerCase();
    if (text != "") {
      let updated = ans.filter((a) => a.isbn.toLowerCase().includes(text));
      res.render(`${req.body.type}`, {
        data: updated,
      });
    }
  }
};

exports.Sort = (req, res) => {
  let updated = [];
  switch (`${req.body.type}`) {
    case "books":
    case "magazines":
      updated = ans.slice().sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
      break;
    case "authors":
      updated = ans.slice().sort((a, b) => {
        if (a.firstname < b.firstname) {
          return -1;
        }
        if (a.firstname > b.firstname) {
          return 1;
        }
        return 0;
      });
      break;
  }
  res.render(req.body.type, {
    data: updated,
  });
};
