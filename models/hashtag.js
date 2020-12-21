module.exports = (sequelize, Sequelize) => (
    sequelize.define('hashtag', {
        title: {
            type: Sequelize.STRING(40),
            allowNull: false,
            unique: true
        }
    }, {
        freezeTableName: true,
        tableName: "hashtag",
        underscored: true,
        timestamps: true,
        paranoid: true
    })
);