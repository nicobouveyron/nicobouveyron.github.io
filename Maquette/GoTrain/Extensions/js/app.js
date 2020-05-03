//#region Constantes
const ADD_LIST = 10;
const ADD_ELEMENT = 100;
const DELETE_ELEMENT = 5;
const DELETE_LIST = 50;
//#endregion

//#region Appels AJAX

    //Fonction d'inscription'
    function Register(){

        var login = $("#Register_login").val();
        var pswd = $("#Register_pswd").val();

        $.ajax({
            url: 'http://92.222.69.104/todo/create/' + login + '/' + pswd,
            dataType: 'json',
            success: function(data) {
                
            }
        });
    }

    //Fonction de connexion
    function Connexion(){

        var login = $("#Connect_login").val();
        var pswd = $("#Connect_pswd").val();

        $.ajax({
            url: "http://92.222.69.104/todo/listes",
            headers: 
            {
                "login" : login,
                "password": pswd
            }
        }).done(function(data) {
            console.log(data);
            Draw(data);
        });
    }

    //Ajout d'une liste
    function Add_List(data){   
        $.ajax({
            type: 'post',
            data: GetFlux(data, ADD_LIST),
            contentType: "application/json; charset=utf-8",
            url: "http://92.222.69.104/todo/listes"
            }).done(function(response) {
                Draw(response);
        });
    }

    //Suppression d'une liste
    function Remove_List(data, index_List){
        $.ajax({
            type: 'post',
            data: GetFlux(data,DELETE_LIST,index_List),
            contentType: "application/json; charset=utf-8",
            url: "http://92.222.69.104/todo/listes"
            }).done(function(response) {
                Draw(response);
        });
    }

    //Ajout d'un élément dans une liste
    function Add_Element(data, index_List){    
        $.ajax({
            type: 'post',
            data: GetFlux(data,ADD_ELEMENT,index_List),
            contentType: "application/json; charset=utf-8",
            url: "http://92.222.69.104/todo/listes"
            }).done(function(response) {
                Draw(response);
        });
    }

//#endregion

//Retourne un flux JSON en fonction de l'action appellée
function GetFlux(data, action, index_List){

    //Paramètres facultatif
    var index_List = index_List | null;

    //Flux de retour avant traitement
    var sFlux = "";

    //Filtre en fonction de l'action demandée
    switch(action){

        //#region Ajout d'une liste
        case ADD_LIST:
                var sFluxList = "";
                var new_list =  prompt("Ajouter une Liste :");
                if(new_list != null){
                    for (let i = 0; i < data.todoListes.length; i++) {
                        if(i>0)
                            sFluxList += "," + JSON.stringify(data.todoListes[i]);
                        else
                            sFluxList += JSON.stringify(data.todoListes[i]);
                    }
                    sFluxList += ",{\"name\": \"" + new_list + "\",\"elements\":[]}";
                    sFlux = `{\"utilisateur\": \"`+ data.utilisateur +`\", \"password\": \"`+ data.password +`\", \"todoListes\": [` + sFluxList + `]}`;                
                }
        break;
        //#endregion

        //#region Ajout d'un élément au sein d'une liste
        case ADD_ELEMENT:

                var sFluxList = "";

                var new_item = prompt("Nouvelle tâche :");
                if(new_item != null){
                    
                
                    //Pour chaque liste
                    for (let i = 0; i < data.todoListes.length; i++) {
                        //Si i est égale à l'indice de la liste sélectionnée
                        if(i == index_List){
                            var item = data.todoListes[i].elements;

                            
                            //Ajout du nouvel élément au tableau
                            item.push(new_item);

                            //Construction du flux
                            if(i>0){
                                sFluxList += ",{\"name\": \""+ data.todoListes[i].name +"\",\"elements\":"+ JSON.stringify(item) +"}";
                            }else{
                                sFluxList += "{\"name\": \""+ data.todoListes[i].name +"\",\"elements\":"+ JSON.stringify(item) +"}";
                            }
                            
                        }else{
                            var item = data.todoListes[i].elements;

                            //Construction du flux
                            if(i>0){
                                sFluxList += ",{\"name\": \""+ data.todoListes[i].name +"\",\"elements\":"+ JSON.stringify(item) +"}";
                            }else{
                                sFluxList += "{\"name\": \""+ data.todoListes[i].name +"\",\"elements\":"+ JSON.stringify(item) +"}";
                            }
                        }
                    }
                    sFlux = `{\"utilisateur\": \"`+ data.utilisateur +`\", \"password\": \"`+ data.password +`\", \"todoListes\": [` + sFluxList + `]}`;
                }
        break;
        //#endregion    

        //#region Suppression d'une liste
        case DELETE_LIST:
            data.todoListes.splice(index_List, 1);
            var sFlux = JSON.stringify(data);
        break;
        //#endregion


        //Suppression d'un élément au sein d'une liste
        case DELETE_ELEMENT:
        break;
            
    }
    console.log(data);
    //Flux de retour après traitement
    return sFlux;
}

//Dessin du flux JSON
function Draw(data){
    var oMain = $("#main");
    oMain.empty();

    for (let n = 0; n < data.todoListes.length; n++) {
        
        //Conteneur global d'une todoList
        $("<div id='toDo-" + n.toString() + "' class='col-lg-3 col-md-4 col-sm-6'>").fadeIn( "slow" ).appendTo($("#main"));
        var oToDo = $("#toDo-" + n.toString());
        oToDo.draggable();
        
        //Création div List
        $("<div class='list-group m-2'>").appendTo(oToDo);
        var oList = oToDo[0].children;

        var oHeader = $("<span class='list-group-item text-center font-weight-bold bg-primary text-light'>"+ data.todoListes[n].name +"</span>").appendTo(oList);
        $("<span id ='del-"+ n +"'class='btn-delete'></span>").appendTo(oHeader);

        for (let i = 0; i < data.todoListes[n].elements.length; i++) {
            var item = data.todoListes[n].elements;

            //Correspond à un item
            var oElement = $("<div id='"+ n +"-"+ i +"' class='list-group-item list-group-item-action'>" + item[i] + "</div>").appendTo(oList);
            $("<span class='btn-edit'></span>").appendTo(oElement);
            $("<span class='btn-remove'></span>").appendTo(oElement);
            
        }
        //Bouton ajouter 
        var oAjouter = $("<span id='add-"+ n +"' class='list-group-item list-group-item-action list-group-item-light text-center btn-add'></span>").appendTo(oList);
        
    }
    Draw_Empty();

    //Dessine le bouton permettant l'ajout d'une liste
    function Draw_Empty(){
        $("#Add").remove();
        $("<div id='Add' class='col-lg-3'>").appendTo($("#main"));
        var oAdd = $("#Add");

        var sHTML = "<div class='fixed-bottom'>"+
                        "<div class='scooter'></div>"+
                        "<span class='list-group-item list-group-item-action list-group-item-primary text-center btn-add'></span>"+
                    "</div>";
        var btnAdd = $(sHTML).appendTo(oAdd);
        init_events(data);
    }

}

function init_events(data){
    $( "#Add" ).click(function() {
        Add_List(data);
    });

    //Gestion des clicks tools liste
    for (let i = 0; i < $("#main")[0].childElementCount; i++) {
        var oList = $("#main")[0].children[i];
        //ajout d'un élément
        $("#add-" + i).click(function() {
            Add_Element(data, i)
        });

        //Suppression d'une liste
        $("#del-" + i).click(function() {
            Remove_List(data, i)
        });
    }
}

//Gestion de la navigation entre les écrans
function init_nav(){
    //Fermer l'inscription et affiche la connexion
    $("#btnRegister").click(function(){
        $("#Register").slideToggle();
        $("#Connect").slideToggle();
    });

    $("#btnBack").click(function(){
        $("#Register").slideToggle();
        $("#Connect").slideToggle();
        
    });

    $("#btnCreate").click(function(){
        $("#Connect").slideToggle();
        $("#Register").slideToggle();
    });


    $("#btnConnexion").click(function(){
        $("#Connect").slideToggle();
    });

}

//Fonction appellée à l'initialisation de la page
function init(){
    //Masque le formulaire d'inscription
    $("#Register").toggle();
    init_nav();
}