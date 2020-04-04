class Company {
    constructor() {
        this.realDepartments = {};
    }
    addEmployee(username, salary, position, department) {
        if (!username || (!salary && salary !== 0) || !position || !department) {
            throw new Error('Invalid input!');
        }
        if (Number(salary) < 0) {
            throw new Error(' Invalid input!');
        }
        if (!this.realDepartments[department]) {
            this.realDepartments[department] = [{
                username,
                salary,
                position
            }]
        } else {
            this.realDepartments[department].push({
                username: username,
                salary: salary,
                position: position
            });
        }

        return `New employee is hired. Name: ${username}. Position: ${position}`;
    }
    bestDepartment() {
        let bestDepartment = this.getHighestAverageSalary(this.realDepartments);
        let result = '';
        result += `Best Department is: ${bestDepartment.highestAvgSalaryDepartment}\n`;
        result+= `Average salary: ${bestDepartment.highestSalary.toFixed(2)}\n`;

        result += this.realDepartments[bestDepartment.highestAvgSalaryDepartment].sort((a, b) => {
            return b.salary - a.salary || a.username.localeCompare(b.username);
        }).map(employee => {
            return `${employee.username} ${employee.salary} ${employee.position}`;
        }).join('\n');

        return result.trim();
    }
    getHighestAverageSalary(departments) {
        let highestAvgSalaryDepartment = Object.keys(this.realDepartments).sort((a, b) => {
            
            let aDepartmentAverageSalary = this.realDepartments[a].reduce((acc, e) =>
                (acc + Number(e.salary), 0) / this.realDepartments[a].length);
            
                let bDepartmentAverageSalary = this.realDepartments[b].reduce((acc, e) =>
                (acc + Number(e.salary), 0) / this.realDepartments[b].length);
            
                return aDepartmentAverageSalary - bDepartmentAverageSalary;
        })[0];

        let highestSalary = this.realDepartments[highestAvgSalaryDepartment]
            .reduce((acc, e) =>
                acc += Number(e.salary), 0) / this.realDepartments[highestAvgSalaryDepartment].length;
        return {
            highestAvgSalaryDepartment,
            highestSalary
        };
    }
}

let c = new Company();
c.addEmployee("Stanimir", 2000, "engineer", "Construction");
c.addEmployee("Pesho", 1500, "electrical engineer", "Construction");
c.addEmployee("Slavi", 500, "dyer", "Construction");
c.addEmployee("Stan", 2000, "architect", "Construction");
c.addEmployee("Stanimir", 1200, "digital marketing manager", "Marketing");
c.addEmployee("Pesho", 1000, "graphical designer", "Marketing");
c.addEmployee("Gosho", 1350, "HR", "Human resources");

console.log(c.bestDepartment());