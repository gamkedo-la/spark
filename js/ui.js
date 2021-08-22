const MAIN_MENU_PAGE = 0;
const OPTIONS_PAGE = 1;
const HELP_PAGE = 2;
const CREDITS_PAGE = 3;

let currentMenu = MAIN_MENU_PAGE;

const menu = new function() {
    let itemsX = 240;
    let itemsY = 200;
    let itemsWidth = 100;
    let itemsHeight = 50;


    let mainMenuList = ['Start','Options','Load'];
    let optionsList = ['Start','Options','Load'];
    let creditList = ['Tylor : Project Lead',];
    let helpText = [];
    let menuText = [mainMenuList,optionsList,creditList,]

    this.checkPosition = function() {
        const selectedItem = menuText[currentMenu][this.cursor];
        for (let i= 0; i<menuText[currentMenu].length; i++) {
            if(selectedItem == menuText[currentMenu][i].toString()) {
                
            }
        }
    }

    this.switchState = function() {
        const selectedItem = menuText[currentMenu][this.cursor];
        switch (selectedItem) {
            case "":
                break;
            case "":
                break;
            case "":
                break;
            case "":
                break;
            case "":
                break;
        }
    }

    this.draw = function() {
        switch(currentMenu){
            case MAIN_MENU_PAGE:
                break;
            case OPTIONS_PAGE:
                break;
            case HELP_PAGE:
                break;
            case CREDITS_PAGE:
                break;       
        }
        //if currentMenu 
        //highlight
        //else alpha = 0
        // 
    }

    this.cursorAtCurrentPage = function(cursor = this.cursor) {
        if (currentMenu !== 0) {
            return
        }
        this.cursor = cursor;
        this.checkPosition();
        currentPage = this.cursor();
        //play SFX
    }

    this.cursorAtMenuArea = function () {
        const  selectedItem= menuText[currentMenu][this.cursor];
        for (let i= 0; i<menuText[currentMenu].length; i++) {
            if (mouseY > itemsY + i*rowHeight && 
                mouseX < itemsX + rowWidth &&
                mouseY < itemsY + i*rowHeight + itemsHeight)
                {
                    this.cursorAtCurrentPage();
                }
        }
    }
    this.update = function (){
        this.cursorAtMenuArea();
        if (this.cursor < 0) {
           this.cursor = menuText[currentMenu].length - 1;
         }
         if (this.cursor >  menuText[currentMenu].length) {
        this.cursor = 0;
        }
    }

};