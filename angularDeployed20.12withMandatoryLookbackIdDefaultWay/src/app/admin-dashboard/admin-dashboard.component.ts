import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import {HttpRequestService} from '../http-request.service';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
  .my-modal-for-edit .modal-content {
    max-width: 1490px !important;
    min-width: 971px !important;   
    width: 95% !important;
  }
  .my-modal-for-editNext .modal-content {
    min-width: 600px;
    
  }
  .my-modal-for-edit .modal-content {
    min-width: 660px;
  
    
    position: relative;
    top: 50%;
    transform: translateY(-10%);
    transform: translateX(-20%);
  }

`] // Styles der Pop-Up-Fenster

})
export class AdminDashboardComponent implements OnInit {


// https://meinformular.herokuapp.com/frage
  url = 'https://meinveranstaltungsformular.herokuapp.com/frage';

  url3 = 'https://meinveranstaltungsformular.herokuapp.com/frage';   //'http://localhost:8090/frage';

  urlAdd = 'https://meinveranstaltungsformular.herokuapp.com/frage/add';// 'http://localhost:8090/frage/add';
  
  urlById: number = -1;
  urlGetbyId = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.urlById;  //'http://localhost:8090/frage/'

  formType: string = ""; 
  urlFormType = 'https://meinveranstaltungsformular.herokuapp.com/type/' + this.formType; //'http://localhost:8090/type/' 

  

// Url für die Kategorien-Methoden (mit String als Parameter) 
  formTypeCat: string = ""; 
  categoryCat: string = ""; 
  urlFormTypeCategory = 'https://meinveranstaltungsformular.herokuapp.com/type/' + this.formTypeCat + '/category/' + this.categoryCat;
  urlCategory = 'https://meinveranstaltungsformular.herokuapp.com/category/' + this.categoryCat;

// Url und Id's für die Bearbeitungs-Methoden 
  editId: number = -1;
  urlEdit: string = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.editId + '/edit';

  editIdNext: number = -1;
  urlEditNext: string = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.editId + '/addfollowing';
 

// Url und Id für die Lösch-Methode 
  deleteIdQuestion = -1;
  urlDelete = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.deleteIdQuestion + '/delete';



  chosenFormType: string = "";
  chosenFormTypeCat: string = "Alle Fragen";
  chosenCategoryCat: string = "keine Kategorie";

  // Hashmap zum Mappen von ID und Question
  public hashIdQuestion: HashQuestion[] = [];

  catOn: boolean = false;


//Array zum anzeigen/ausblenden der Edit-Button bei einer in FrageListe
  showOnHover: boolean[] = [];


// Any-Objekte zum speichern der Daten aus GET-Requests
  public data: any;

  public dataOne: any;
  byIdOn: boolean = false;

  public data4: any;

  public dataSet =  new Set();
  public dataSetCat =  new Set();

  public dataDisplay: any;



antwortMoeglichkeiten: Kategorien[] = [];

formularTypMoeglichkeiten: string[] = [];

// Booleans für die getätigte Auswahl bei Antwort-Typ
radioOn: boolean = false;
CheckOn: boolean = false;
TextOn: boolean = false;
datumOn: boolean = false;
dateiUploadOn: boolean = false;
dropdownOn: boolean = false;


mandatoryOn: boolean = true;



deleteOn:boolean = false;
editOn: boolean = false;

// Anzahl der aktuellen Antwort-optionen und Kategorien
antOpAnzahl: number = 1;

catOpAnzahl: number = 1;



// Arrays zum Speichern der Choices und Kategorien und die Ausgabe in Html
fakeArray = new Array(this.antOpAnzahl);
realArray = new Array<String>(this.fakeArray.length);
fakeChoiceArray = new Array(this.antOpAnzahl);
choiceArray = new Array<Choices>(); 
choiceExample: Choices = {id: 0, choice: "", nextQuestionId: null};
fakeCategoryArray = new Array(this.catOpAnzahl);
categoryArray = new Array<QuestionCategory>();



antOpString: string = "";

question: Question = {id: 0, question: "Was ist dein Alter", questionType: null, mandatory: false, lookbackId: 0, hint: "no Hinweis", formType: "Gewerbe", questionCategory: null};

choices: Choices = {id: 0, choice: "", nextQuestionId: null};

chArray: Choices[] = [this.choices];

questionType: QuestionType = {id: 0, type: "", defaultWay: 0, useDefault: false, choices: this.chArray }; 

questionCategory: QuestionCategory = {id: 0, category: "", processNumber: 1}; 


qtArray: QuestionType[] = [this.questionType];
qcArray: QuestionCategory[] = [this.questionCategory];

currentId:number = 0;
check:boolean = false;

closeResult: string;


constructor(private api: HttpRequestService, private modalService: NgbModal) { } // private popupcreateComponent: popupcreateFrageComponent
//constructor(private modalService: NgbModal) {}





ngOnInit() {

this.hashIdQuestion = [];

/**
 * Text-Eingabe (keine Choices --> TextOn)
 * Zahlen-Eingabe (keine Choices --> TextOn)?
 * Datum (keine Choices u. --> Datepicker)
 * RadioButton/Dropdown (Choices --> RadioOn)
 * Checkbox (Choices --> CheckOn)
 * Text u. CheckBox (Choices --> TextCheckOn)
 * Text u. RadioButton (Choices --> TextRadioOn)
 * Datei-Upload (Choices (Anzahl der Dateien bzw. Dateitypen) => FileOn )
 * 
 */
//this.antwortMoeglichkeiten = [{id: 1, name: "Text-Eingabe"},{id: 2, name: "RadioButton"},{id: 3, name: "Checkbox"}, {id: 4, name: "Text u. Checkbox"}];
this.antwortMoeglichkeiten = [{id: 1, name: "Text-Eingabe"},{id: 2, name: "RadioButton"},{id: 3, name: "Checkbox"}, {id: 4, name: "Dropdown"}, {id: 4, name: "Datum"}, {id: 4, name: "Datei-Upload"}];

this.formularTypMoeglichkeiten = ["Veranstaltung", "Gewerbeanmeldung"];

this.antOpAnzahl = 1;
this.catOpAnzahl = 1;

this.chosenFormType = "";
this.chosenFormTypeCat = "Alle Fragen";
this.chosenCategoryCat = "keine Kategorie";



let chbsp: Choices = {id: 0, choice: "", nextQuestionId: null};
this.choiceArray.push(chbsp);

let catbsp: QuestionCategory = {id: 0, category: "", processNumber: 0};
this.categoryArray.push(catbsp);
console.log(this.categoryArray);

this.question = {id: 2, question: "Frage eingeben", questionType: this.questionType, mandatory: false, lookbackId: 0, hint: "", formType: "Gewerbean u. umeldung", questionCategory: this.qcArray};

this.dataOne = this.question;




console.log("Changes worked so far so good");
this.api
.getQuestion(this.url3)
.subscribe(
  dataDisplay => {
    console.log(dataDisplay);
    this.dataDisplay = dataDisplay;
    this.data = dataDisplay;

    this.dataSetCat = new Set<String>();
    this.dataSetCat.add("keine Kategorie");
    for(let u1 = 0; u1 < dataDisplay.length; u1++){
      for(let u2 = 0; u2 < dataDisplay[u1].questionCategories.length; u2++){
        this.dataSetCat.add(dataDisplay[u1].questionCategories[u2].category);
    }
  }
    console.log(this.dataSetCat);

    this.dataSet =  new Set<String>();
    this.dataSet.add("Alle Fragen");
    for(let u = 0; u < dataDisplay.length; u++){
      this.dataSet.add(dataDisplay[u].formType);

      this.showOnHover.push(false);

      this.hashIdQuestion.push( {key: dataDisplay[u].id, value: dataDisplay[u].question} );
      
    }
    console.log(this.dataSet);
    console.log(this.hashIdQuestion);
  },
  err => {
    console.log(err);
  }
);

}

// wird ausgeführt wenn ein Antwort-Typ ausgewählt wird
  toggleEdit(){

    if(this.question.questionType.type == "RadioButton"){this.radioOn = true;}else{this.radioOn = false;}
    if(this.question.questionType.type == "Checkbox"){this.CheckOn = true;}else{this.CheckOn = false;}
    if(this.question.questionType.type == "Text-Eingabe"){this.TextOn = true;}else{this.TextOn = false;}
    if(this.question.questionType.type == "Dropdown"){this.dropdownOn = true;}else{this.dropdownOn = false;}
    if(this.question.questionType.type == "Datum"){this.datumOn = true;}else{this.datumOn = false;}
    if(this.question.questionType.type == "Datei-Upload"){this.dateiUploadOn = true;}else{this.dateiUploadOn = false;}
      //this.isEdit = !this.isEdit;
  }


  changeMandatory = (evt) => {    
    this.question.mandatory = evt.target.checked;
    console.log(this.question.mandatory);
  }



// Für den Filter (Filtern nach Formular-Art und dann nach deren Kategorie)
changeCatOn(): void{

    this.catOn = true;
    this.dataSetCat =  new Set<String>();
    this.dataSetCat.add("keine Kategorie");
    for(let t = 0; t < this.data.length; t++){
     
      if(this.chosenFormTypeCat == this.data[t].formType){
        
        for(let g = 0; g < this.data[t].questionCategories.length; g++){

          this.dataSetCat.add(this.data[t].questionCategories[g].category);
        }
      }
    }
  this.chosenCategoryCat = "keine Kategorie";
  this.getAllQuestionsOfFormTypeWithinCategory();
  }


// Bei Klick auf eine Der Fragen aus dem Fragekatalog werden die Daten der geklickten Frage geladen
  loadQuestion(question: any): void {

    this.mandatoryOn = question.mandatory;

    this.urlGetbyId = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.question.id;

    this.api.getQuestionbyId(this.urlGetbyId).subscribe(dataOne => {console.log(dataOne); question = dataOne;},err => {console.log(err);});
    
    this.deleteIdQuestion = question.id;  
    this.deleteOn = true;
    this.editOn = true;
  
    this.question.question = question.question;
    this.question.id = question.id;
    this.question.hint = question.hint;
    this.question.questionType = question.questionType;
    this.question.mandatory = question.mandatory;
    this.question.lookbackId = question.lookbackId;
    this.question.questionCategory = question.questionCategories;
    this.question.formType = question.formType;

    this.toggleEdit();
    //console.log(question.questionCategories);
    this.categoryArray = question.questionCategories;
    this.choiceArray = question.questionType.choices;
    //console.log(this.choiceArray);console.log(this.categoryArray);
    this.fakeChoiceArray = new Array(this.choiceArray.length);
    this.fakeCategoryArray = new Array(this.categoryArray.length);
    this.antOpAnzahl = this.choiceArray.length
    this.catOpAnzahl = this.categoryArray.length
    console.log("Mandatory: " + question.mandatory);

  }



createQuestion(): void{

  this.api
.getQuestion(this.url3)
.subscribe(
  data => {
    console.log(data);
    this.data = data;
    this.dataDisplay = data;

    this.dataSetCat = new Set<String>();
    this.dataSetCat.add("keine Kategorie")
    for(let u1 = 0; u1 < data.length; u1++){
      for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
      this.dataSetCat.add(data[u1].questionCategories[u2].category);
    }
  }
    console.log(this.dataSetCat);

    this.showOnHover = [];
    this.dataSet =  new Set<String>();
    this.dataSet.add("Alle Fragen");
    for(let u = 0; u < data.length; u++){
      this.dataSet.add(data[u].formType);
      this.showOnHover.push(false);
    }
    console.log(this.dataSet);

  },
  err => {
    console.log(err);
  }
);


if(!this.check){
  if(this.data.length > 0){  
    this.currentId = this.data[this.data.length -1].id + 1;
    this.question.id = this.currentId;
  }else{
    this.question.id = 1;
  }
 
}//

  let zt: number = this.data[this.data.length - 1].questionType.id + 1;

  let questionZw: QuestionType = {id: zt, type: this.question.questionType.type, defaultWay: 0, useDefault: false, choices: this.choiceArray}; 


  this.question.questionType = questionZw;

  let categoryZw: QuestionCategory[] = this.categoryArray;
  this.question.questionCategory = this.categoryArray; 
  
  this.dataSet.add(this.question.formType);
  this.showOnHover.push(false);

  for(let u1 = 0; u1 < this.question.questionCategory.length; u1++){
    
    this.dataSetCat.add(this.question.questionCategory[u1].category);
  
}
  

// Für die Post-Methode werden einige Attr. der Question nicht gebraucht, und daher werden hier neue Objekte nur mit den relevanten Attr. erstellt
  // Die Objekte von den "GET"-Methoden werden gekürtzt (Id's werden gelöscht) für die Post/Put-methoden
  let dataShortChoices: ChoicesShort[] = [];
    for(let r = 0; r < this.question.questionType.choices.length; r++){
      dataShortChoices.push({choice: this.question.questionType.choices[r].choice} );//,nextQuestionId: this.question.questionType.choices[r].nextQuestionId});
    }
      
    let dataShortQuestionType: QuestionTypeShort;
    dataShortQuestionType = {type: this.question.questionType.type, choices: dataShortChoices}; //,nextQuestionId: this.question.questionType.nextQuestionId};

    let dataShortCategory: QuestionCategoryShort[] = [];
    for(let r = 0; r <this.question.questionCategory.length; r++){
      dataShortCategory.push({category: this.question.questionCategory[r].category, processNumber: this.question.questionCategory[r].processNumber});
    console.log("Kat: " + this.question.questionCategory[r].category);
    }
   
    let dataShort: QuestionShort;

    dataShort = {question: this.question.question, mandatory: this.question.mandatory, lookbackId: this.question.lookbackId, questionType: dataShortQuestionType, hint: this.question.hint, formType: this.question.formType, questionCategories: dataShortCategory };
    console.log("Changes wurden gespeichert");
  this.api.addQuestion(dataShort, this.urlAdd).subscribe(data => {console.log(data); this.data = data; this.dataDisplay = data;}, err => {console.log(err);});

  //}
  console.log("Changes wurden gespeichert");

  
  setTimeout(window.location.reload.bind(window.location), 1250);
 //location.reload();

}





getAllQuestion(): void {
  console.log("Changes wurden gespeichert!!!!!!!!!!!!!!!!");
  this.api.getQuestion(this.url3).subscribe(data => {console.log(data);this.data = data; this.dataDisplay = data; 
    

    this.dataSetCat = new Set<String>();
    this.dataSetCat.add("keine Kategorie")
        for(let u1 = 0; u1 < data.length; u1++){
          for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
            this.dataSetCat.add(data[u1].questionCategories[u2].category);
          }
        }
    this.showOnHover = [];
    this.dataSet =  new Set<String>();
    this.dataSet.add("Alle Fragen");
    for(let u = 0; u < data.length; u++){
        this.dataSet.add(data[u].formType);
        this.showOnHover.push(false);
      }
      console.log(this.dataSet);

      },err => {console.log(err);});
  
}

getQuestionByIdForFrontend(id: number): string{

  for(let z = 0; z < this.hashIdQuestion.length; z++){

    if(id == this.hashIdQuestion[z].key){
      return this.hashIdQuestion[z].value;
    }

  }
  return "N.A."

}



getQuestionById(): void {
  
  let zw: boolean = false;
  for(let i = 0; i < this.data.length; i++){
      
     if(this.urlById == this.data[i].id){
        zw = true;  
     }
  }

  if(zw){
    this.urlGetbyId = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.urlById;

    this.api.getQuestionbyId(this.urlGetbyId).subscribe(dataOne => {console.log(dataOne);this.dataOne = dataOne;},err => {console.log(err);});
  
    this.byIdOn = true;
  }
}



getFormType(): void{

  let zw: boolean = false;

  for(let i = 0; i < this.data.length; i++) {
      
     if(this.chosenFormType == this.data[i].formType){
        zw = true;  
     }
  }

  if(zw){

    this.formType = this.chosenFormType;
    this.urlFormType = 'https://meinveranstaltungsformular.herokuapp.com/type/' + this.formType;

    this.api.getFormType(this.urlFormType).subscribe(data4 => {console.log(data4);this.data4 = data4;this.dataDisplay = data4;},err => {console.log(err);});
    
  }

}



getCategory(): void{


    this.categoryCat = this.chosenCategoryCat; 
    console.log(this.chosenCategoryCat);
    this.urlCategory = 'https://meinveranstaltungsformular.herokuapp.com/category/' + this.categoryCat;

    this.api.getFormType(this.urlCategory).subscribe(data4 => {console.log(data4);this.data4 = data4;this.dataDisplay = data4;},err => {console.log(err);});
    
  }



getAllQuestionsOfFormTypeWithinCategory(): void {


  if(this.chosenFormTypeCat == "Alle Fragen"){
    if(this.chosenCategoryCat != "keine Kategorie"){
      
        this.getCategory();

      }else{

      	this.getAllQuestion();
      
    }

  }else{
    if(this.chosenCategoryCat == "keine Kategorie"){
  
      this.formType = this.chosenFormTypeCat;
      this.urlFormType = 'https://meinveranstaltungsformular.herokuapp.com/type/' + this.formType;
  
      this.api.getFormType(this.urlFormType).subscribe(data4 => {console.log(data4);this.data4 = data4;this.dataDisplay = data4;},err => {console.log(err);});
      
    }else{

      this.formTypeCat = this.chosenFormTypeCat; 
      this.categoryCat = this.chosenCategoryCat; 
      this.urlFormTypeCategory = 'https://meinveranstaltungsformular.herokuapp.com/type/' + this.formTypeCat + '/category/' + this.categoryCat;

      this.api.getAllQuestionsOfFormTypeWithinCategory(this.urlFormTypeCategory).subscribe(data4 => {console.log(data4);this.data4 = data4;this.dataDisplay = data4;},err => {console.log(err);});
    }
  }

}






//AddNextQuestionId
editQuestionNextQuestionId(): void{
    console.log(this.choiceArray)
    console.log(this.hashIdQuestion);
  let questionZw: QuestionType = {id: this.question.questionType.id, type: this.question.questionType.type, defaultWay: this.question.questionType.defaultWay, useDefault: false, choices: this.choiceArray}; //, question: this.question 
  

  this.question.questionType = questionZw;
  
  let categoryZw: QuestionCategory[] = this.categoryArray;
  this.question.questionCategory = this.categoryArray;//categoryZw;

  this.editId = this.question.id;
  this.urlEditNext = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.editId + '/edit';



// Die Objekte von den "GET"-Methoden werden gekürtzt (Id's werden gelöscht) für die Post/Put-methoden
    let dataShortChoices: ChoicesShortNext[] = [];
    for(let r = 0; r < this.question.questionType.choices.length; r++){
      dataShortChoices.push({choice: this.question.questionType.choices[r].choice, nextQuestionId: this.question.questionType.choices[r].nextQuestionId} );//,nextQuestionId: this.question.questionType.choices[r].nextQuestionId});
    }
      
    let dataShortQuestionType: QuestionTypeShortNext;
    dataShortQuestionType = {type: this.question.questionType.type, defaultWay: this.question.questionType.defaultWay, choices: dataShortChoices}; //,nextQuestionId: this.question.questionType.nextQuestionId};

    let dataShortCategory: QuestionCategoryShortNext[] = [];
    for(let r = 0; r < this.question.questionCategory.length; r++){
      dataShortCategory.push({category: this.question.questionCategory[r].category, processNumber: this.question.questionCategory[r].processNumber});
    }

    let dataShort: QuestionShortNext;
    dataShort = {question: this.question.question, questionType: dataShortQuestionType, hint: this.question.hint, formType: this.question.formType, questionCategories: dataShortCategory };
 
    this.api.editQuestionNext(this.urlEditNext, dataShort, this.editId).subscribe(data => {console.log(data);this.data = data;this.dataDisplay = data;
      
      this.dataSetCat = new Set<String>();
      this.dataSetCat.add("keine Kategorie")
      for(let u1 = 0; u1 < data.length; u1++){
        for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
          this.dataSetCat.add(data[u1].questionCategories[u2].category);
        }
      }
          this.dataSet =  new Set<String>();
          this.dataSet.add("Alle Fragen");
          for(let u = 0; u < data.length; u++){
            this.dataSet.add(data[u].formType);
          }
          console.log(this.dataSet);

    },err => {console.log(err);});
  
  this.editOn = false;
  this.deleteOn = false;

  setTimeout(window.location.reload.bind(window.location), 1250);
 // location.reload();
  
}


resetQuestion(): void{

  this.antOpAnzahl = 1;
  this.fakeChoiceArray = new Array(this.antOpAnzahl); 

  this.choiceArray = new Array<Choices>(); 
  let chbsp: Choices = {id: 0, choice: "", nextQuestionId: null};
  this.choiceArray.push(chbsp);

  this.catOpAnzahl = 1;
  this.fakeCategoryArray = new Array(this.catOpAnzahl);
  this.categoryArray = new Array<QuestionCategory>();
  let catbsp: QuestionCategory = {id: 0, category: "", processNumber: 0};
  this.categoryArray.push(catbsp);



  this.choices = {id: 0, choice: "", nextQuestionId: null};
  this.chArray = [this.choices];
  this.questionType = {id: 0, type: "", defaultWay: 0, useDefault: false, choices: this.chArray };
  this.questionCategory = {id: 0, category: "", processNumber: 1}; 
  this.qcArray = [this.questionCategory];


  this.question = {id: 2, question: "Frage eingeben", questionType: this.questionType, mandatory: true, lookbackId: 0, hint: "", formType: "", questionCategory: this.qcArray};
  this.toggleEdit();
}



//Put-Methode ohne NextQUestionId
editQuestion(): void{
    
  let questionZw: QuestionType = {id: this.question.questionType.id, type: this.question.questionType.type, defaultWay: this.question.questionType.defaultWay, useDefault: this.question.questionType.useDefault, choices: this.choiceArray}; //, question: this.question 

  
  this.question.questionType = questionZw;
  
  let categoryZw: QuestionCategory[] = this.categoryArray;
  this.question.questionCategory = this.categoryArray;//categoryZw;

  this.editId = this.question.id;
  this.urlEdit = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.editId + '/edit';

// Die Objekte von den "GET"-Methoden werden gekürtzt (Id's werden gelöscht) für die Post/Put-methoden
    let dataShortChoices: ChoicesShort[] = [];
    for(let r = 0; r < this.question.questionType.choices.length; r++){
      dataShortChoices.push({choice: this.question.questionType.choices[r].choice} );//,nextQuestionId: this.question.questionType.choices[r].nextQuestionId});
    }
      
    let dataShortQuestionType: QuestionTypeShort;
    dataShortQuestionType = {type: this.question.questionType.type, choices: dataShortChoices}; //,nextQuestionId: this.question.questionType.nextQuestionId};

    let dataShortCategory: QuestionCategoryShort[] = [];
    for(let r = 0; r < this.question.questionCategory.length; r++){
      dataShortCategory.push({category: this.question.questionCategory[r].category, processNumber: this.question.questionCategory[r].processNumber});
    }

    let dataShort: QuestionShortPut;

    dataShort = {question: this.question.question, mandatory: this.question.mandatory, questionType: dataShortQuestionType, hint: this.question.hint, formType: this.question.formType, questionCategories: dataShortCategory };

  this.api.editQuestion(this.urlEdit, dataShort, this.editId).subscribe(data => {console.log(data);this.data = data;this.dataDisplay = data;
    
    this.dataSetCat = new Set<String>();
    this.dataSetCat.add("keine Kategorie")
    for(let u1 = 0; u1 < data.length; u1++){
      for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
      this.dataSetCat.add(data[u1].questionCategories[u2].category);
    }
  }
        this.dataSet =  new Set<String>();
        this.dataSet.add("Alle Fragen");
        for(let u = 0; u < data.length; u++){
          this.dataSet.add(data[u].formType);
        }
        console.log("Set :" + this.dataSet);

  },err => {console.log(err);});

  this.editOn = false;
  this.deleteOn = false;





  setTimeout(window.location.reload.bind(window.location), 1250);
  //location.reload();
  
}



//___________________________________________________________________________________________________________________
  

  open(content) { 
    this.modalService.open(content, {backdrop:'static', windowClass : "my-modal-for-editNext"}).result.then((result) => {  // { size: 'lg', backdrop: 'static' }    { windowClass : "my-modal-for-editNext"}   {ariaLabelledBy: 'modal-basic-title'}
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open2(content) { 
    this.modalService.open(content, {backdrop:'static', windowClass : "my-modal-for-edit"}).result.then((result) => {  // { size: 'lg', backdrop: 'static' }    { windowClass : "my-modal-for-editNext"}   {ariaLabelledBy: 'modal-basic-title'}
      this.closeResult = `Closed with: ${result}`;
      console.log("Changes wurden gespeichert");
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log("Changes wurden gespeichert");
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


 
deleteQuestion(id: number): void{

console.log("DIe Id lautet: " + id);

  if(id == -1){
this.deleteIdQuestion = this.question.id;
  }else{
    this.deleteIdQuestion = id;
  }


this.urlDelete = 'https://meinveranstaltungsformular.herokuapp.com/frage/' + this.deleteIdQuestion + '/delete';

this.api.deleteQuestion(this.urlDelete, this.deleteIdQuestion).subscribe(data => {console.log(data);this.data = data; this.dataDisplay = data;

  this.dataSetCat = new Set<String>();
  this.dataSetCat.add("keine Kategorie")

  for(let u1 = 0; u1 < data.length; u1++){
    for(let u2 = 0; u2 < data[u1].questionCategories.length; u2++){
    this.dataSetCat.add(data[u1].questionCategories[u2].category);
  }
}
        this.showOnHover = [];
        this.dataSet =  new Set<String>();
        this.dataSet.add("Alle Fragen");

        for(let u = 0; u < data.length; u++){
          this.dataSet.add(data[u].formType);
          this.showOnHover.push(false);
        }
        console.log(this.dataSet);

},err => {console.log(err);});

this.deleteIdQuestion = -1;
this.deleteOn = false;
this.editOn = false;

setTimeout(window.location.reload.bind(window.location), 1250);

//location.reload();

}



addInput(){

    let ch: Choices = {id: 0, choice: "", nextQuestionId: null};

    this.antOpAnzahl += 1;
   // this.fakeArray = new Array(this.antOpAnzahl); 
    this.fakeChoiceArray = new Array(this.antOpAnzahl);

    // ch.questionType = this.qtArray;

    if(this.choiceArray.length > 0){
      ch.id = this.choiceArray[this.choiceArray.length - 1].id + 1;
    }else{
      ch.id = 0;
      //this.choiceArray[this.choiceArray.length - 1].id = 0;
    }
      
    this.choiceArray.push(ch);
    console.log(this.choiceArray);
  }


// Methoden zur Anpassung der Choice- und Kategorie-Arrays 
deleteInput(){

    if(this.antOpAnzahl > 0){
      this.antOpAnzahl -= 1;
      this.fakeChoiceArray = new Array(this.antOpAnzahl); 
      this.choiceArray.pop();
  }
}


addInputCat(){

    let cat: QuestionCategory = {id: 0, category: "", processNumber: 0};
    this.catOpAnzahl += 1;
    this.fakeCategoryArray = new Array(this.catOpAnzahl);
    //cat.category = this.qtArray;

    if(this.categoryArray.length > 0){
      
      cat.id = this.categoryArray[this.categoryArray.length - 1].id + 1;
    }else{
      cat.id = 0;
 
    }
      
    this.categoryArray.push(cat);
    console.log(this.categoryArray);
    console.log(this.fakeCategoryArray.length);
  }


  deleteInputCat(){

    if(this.catOpAnzahl > 0){
      this.catOpAnzahl -= 1;
      this.fakeCategoryArray = new Array(this.catOpAnzahl); 
      this.categoryArray.pop();
    }
  }

}





//______________________________________________________________________________________________________________________________
//--------------------------------------------------------------------------------------------------------------------------------


interface HashQuestion{

  key:number,
  value:string

}


interface QuestionType{

  id:number,
  type:string,
  defaultWay:number,
  useDefault: boolean,
  choices:Array<Choices>

}

interface QuestionCategory{

  id:number,
  category:string,
  processNumber:number

}


interface Choices{

  id:number,
  choice:string,
  nextQuestionId:number,
  //questionType:Array<QuestionType>

}


interface Question{

  id:number,
  question:string,
  questionType:QuestionType,
  mandatory: boolean,
  lookbackId: number,
  hint:string,
  formType:string,
  questionCategory:Array<QuestionCategory>

}


//--------------------------------------------------------------------------------------------------------------------------


interface QuestionTypeShort{

  type:string,
  choices:Array<ChoicesShort>
  
  }
  
  
interface QuestionCategoryShort{
  

  category:string,
  processNumber:number
  
  }
  
  
interface ChoicesShort{
  
  choice:string,
  
  }
  
// For Post-Request (createQuestion)  
interface QuestionShort{
  
  question:string,
  mandatory: boolean,
  lookbackId: number,
  questionType:QuestionTypeShort,
  hint:string,
  formType:string,
  questionCategories:Array<QuestionCategoryShort>,
  
  }

// For Put-Request (editQuestion)
  interface QuestionShortPut{
  
    question:string,
    mandatory: boolean,
    questionType:QuestionTypeShort,
    hint:string,
    formType:string,
    questionCategories:Array<QuestionCategoryShort>,
    
    }



//-------------------------------------------------------------------------------------------------------------------------------
// Only for Inserting NextQuestionId

interface QuestionTypeShortNext{

  type:string,
  defaultWay:number,
  choices:Array<ChoicesShortNext>
  
}
  
  
interface QuestionCategoryShortNext{
  
  category:string,
  processNumber:number
  
}
  
  
interface ChoicesShortNext{

  choice:string,
  nextQuestionId:number
  
}
  
  
interface QuestionShortNext{
  
  question:string,
  questionType:QuestionTypeShortNext,
  hint:string,
  formType:string,
  questionCategories:Array<QuestionCategoryShortNext>,
  
}
  //---------------------------------------------------------------------------------------------------------------------------


interface Kategorien{
   
  id:number,
  name:string

}
