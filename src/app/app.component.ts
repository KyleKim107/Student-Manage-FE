import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[];
  public editEmployee: Employee;
  public deleteEmployee: Employee;


  constructor(private employeeService: EmployeeService) { }

  ngOnInit() { // 시작할때 직원들을 가진다
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddEmloyee(addForm: NgForm): void {
    document.getElementById('add-employee-form')!.click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmloyee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmloyee(employeeId: number): void {
    this.employeeService.deleteEmployee(Number(employeeId) ).subscribe( // after remove the employee
      (response: void) => {
        console.log(response);
        this.getEmployees(); // upload all the employees on the display.
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void {
    console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 // check name
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 // check email
        || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1 // phone
        || employee.jobtitle.toLowerCase().indexOf(key.toLowerCase()) !== -1
        ) { // job title
        results.push(employee);
      }
    }
    this.employees = results; // push employees in the list.
    if (results.length === 0 || !key) {
      this.getEmployees(); // display all of them.
    }
  }
  // mode means what the user trying to do
  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button'); // create button
    button.type = 'button';
    button.style.display = 'none'; // hide unless the user open it
    button.setAttribute('data-toggle', 'modal'); // set the CSS attributes
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button);// passing the button
    button.click(); // click
  }

}
