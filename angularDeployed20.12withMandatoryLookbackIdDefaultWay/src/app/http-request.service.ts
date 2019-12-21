import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor(private http: HttpClient) { }



  public getFrage(url: string): any {
    return this.http.get(url).pipe(map(response => {
        return response;
      }));
  }




  public getQuestion(url: string): any {
    return this.http.get(url).pipe(map(response => {
        return response;
      }));
  }

  public getQuestionbyId(url: string): any {
    return this.http.get(url).pipe(map(response => {
      return response;
    }));
  }

  public addQuestion(question: any, url: string): any {
    return this.http.post<any>(url, question);
  }



  public getFormType(url: string): any {

    return this.http.get(url).pipe(map(response => {
      return response;
    }));
    
    }

    public getCategory(url: string): any {

      return this.http.get(url).pipe(map(response => {
        return response;
      }));
      
      }
  

    

  public getAllQuestionsOfFormTypeWithinCategory(url: string): any {

      return this.http.get(url).pipe(map(response => {
        return response;
      }));
      
    }

  public editQuestion(url: string, question: any, id: any): any {

    return this.http.put<any>(url, question, id);

  }

  public editQuestionNext(url: string, question: any, id: any): any {

    return this.http.put<any>(url, question, id);

  }



public deleteQuestion(url: string, id: any): any {

  return this.http.delete<any>(url, id);

}









  public createFrage(frage: any, url: string): any{

    return this.http.post<any>(url, frage);

  }


  public deleteFrage(id: any, url: string): any{

    return this.http.delete<any>(url, id);

  }


  public updateFrage(frage: any, url: string): any{

    return this.http.put<any>(url, frage);

  }













  public getPersonen(url: string): any {
    return this.http.get(url).pipe(map(response => {
        return response;
      }));
  }


  public createPerson(person: any, url: string): any{

    return this.http.post<any>(url, person);

  }


  public deletePerson(id: any, url: string): any{

    return this.http.delete<any>(url, id);

  }


  public updatePerson(person: any, url: string): any{

    return this.http.put<any>(url, person);

  }


  


  /** 
  public addPersonen(person: Person): any {
    return this.http.get(url).pipe(map(response => {
        return response;
      }));
  }*/

}