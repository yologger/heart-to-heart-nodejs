module.exports = (sequelize, Sequelize) => (
    sequelize.define('session', {
        access_token: {
            type: Sequelize.STRING(300),
            allowNull: true
        },
        refresh_token: {
            type: Sequelize.STRING(300),
            allowNull: true
        }
    }, {
        freezeTableName: true,
        tableName: "session",
        underscored: true,
        timestamps: true,
        paranoid: true
    })
);