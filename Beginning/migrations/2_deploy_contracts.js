const MonsterCookie = artifacts.require("./MonsterCookie.sol");

module.exports = function (deployer) {
    deployer.deploy(MonsterCookie, "Joseph");
};