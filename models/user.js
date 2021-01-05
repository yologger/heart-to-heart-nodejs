module.exports = (sequelize, Sequelize) => (
    sequelize.define('user', {
        email: {
            type: Sequelize.STRING(40),
            allowNull: true,
            unique: true
        },
        first_name: {
            type: Sequelize.STRING(25),
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING(25),
            allowNull: false
        },
        nickname: {
            type: Sequelize.STRING(25),
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        access_token: {
            type: Sequelize.STRING(300),
            allowNull: true
        },
        refresh_token: {
            type: Sequelize.STRING(300),
            allowNull: true
        },
        url: {
            type: Sequelize.STRING(300),
            allowNull: true
        }
    }, {
        freezeTableName: true,
        tableName: "user",
        underscored: true,
        timestamps: true,
        paranoid: true
    })
);