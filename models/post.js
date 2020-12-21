module.exports = (sequelize, Sequelize) => (
    sequelize.define('post', {
        content: {
            type: Sequelize.STRING(100),
            notNull: true
        },
    }, {
        freezeTableName: true,
        tableName: "post",
        underscored: true,
        timestamps: true,
        paranoid: true
    })
);