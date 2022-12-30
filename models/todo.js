'use strict';
const {
  Model,Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params){
      return await Todo.create(params);
    }
    static async showList(){
      console.log("My Todo list \n");
      console.log("OverDue");
      const overdueitemslist=await Todo.overdue();
      console.log(overdueitemslist.map((data)=> data.displayableString()).join("\n"));
      console.log("\n");
      console.log("Due Today");
      const dueTodayitemslist = await Todo.dueToday();
			console.log(
				dueTodayitemslist.map((data) => data.displayableString()).join("\n")
			);
			console.log("\n");
      console.log("Due Later");
      const dueLateritemslist = await Todo.dueLater();
			console.log(
				dueLateritemslist.map((data) => data.displayableString()).join("\n")
			);
    }
    static async overdue(){
      return Todo.findAll({
        where:{
          dueDate:{[Op.lt]:new Date(),},
        },
      });
    }
    static async dueToday(){
      return Todo.findAll({
        where:{
          dueDate:{[Op.eq]:new Date(),},
        },
        order: [['id','ASC']],
      });
    }
    static async dueLater(){
      return Todo.findAll({
        where:{
          dueDate:{[Op.gt]:new Date(),},
        },
        order: [['id','ASC']],
      });
    }
    static async markAsComplete(id){
      return await Todo.update(
        {completed:true},
        {where :{id: id,},}
      );
    }
    displayableString(){
			return `${this.id}. ${this.completed ? "[x]" : "[ ]"} ${this.title}${this.dueDate === new Date().toLocaleDateString("en-CA") ? "": ` ${this.dueDate}`}`;
    }
    static associate(models) {
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};

