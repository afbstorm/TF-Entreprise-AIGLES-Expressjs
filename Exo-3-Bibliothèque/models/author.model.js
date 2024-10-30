module.exports = (sequelize, DataTypes) => {
    const Author = sequelize.define('Author', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('reader', 'author'),
            defaultValue: 'reader'
        }
    });

    Author.associate = (models) => {
        Author.hasMany(models.Book, {
            foreignKey: 'authorId',
            as: 'books'
        });
    };

    return Author;
};
