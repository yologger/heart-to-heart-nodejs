module.exports = (sequelize, Sequelize) => (
    sequelize.define('favorite', {
        userId : {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        tableName: "favorite",
        underscored: true,
        timestamps: true,
        paranoid: true
    })
);