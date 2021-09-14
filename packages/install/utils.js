const sudo = require("sudo");
const { is } = require("contractis");
const { spawnSync } = require("child_process");
const os = require("os");

const asyncSudo = (args) => {
  console.log(args);
  return new Promise(function (resolve, reject) {
    var child = sudo(args, { cachePassword: true });
    //var child = sudo(['ls'], {cachePassword: true})
    child.stdout.on("data", function (data) {
      console.log(data.toString());
    });
    child.stderr.on("data", function (data) {
      console.error(data.toString());
    });
    child.on("exit", function (data) {
      resolve();
    });
  });
};

const asyncSudoUser = (user, args) => {
  if (os.userInfo().username === user) {
    const [arg0, ...rest] = args;
    spawnSync(arg0, rest, {
      stdio: "inherit",
    });
  } else return asyncSudo(["sudo", "-iu", user, ...args]);
};

const asyncSudoPostgres = (args) => {
  return asyncSudoUser(["postgres", ...args]);
};

const gen_password = () => {
  const s = is.str.generate().replace(" ", "");
  if (s.length > 7) return s;
  else return gen_password();
};

module.exports = { asyncSudo, asyncSudoPostgres, asyncSudoUser, gen_password };
