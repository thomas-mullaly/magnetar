export class Welcome {
    heading: string = "Hello Aurelia";
    firstName: string = "Thomas";
    lastName: string = "Mullaly";

    get fullName() : string {
        return `${this.firstName} ${this.lastName}`;
    }

    submit(): void {
        alert(`Welcome ${this.fullName}!`);
    }
}