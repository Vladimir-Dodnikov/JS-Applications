//{HTMLElement} formRef Reference to html element of type 'form'
//{string[]} formConfig string array describing the 'name' attribute in form
const extractFormData = (formRef, formConfig) => {
    return formConfig.reduce((acc, inputName) => {
        acc[inputName] = formRef.elements[inputName].value;
        return acc;
    }, {});
};

const fillFormWithData = (formRef, formValue) => {
    if (!formValue) {
        return;
    }
    Object.entries(formValue).map(([inputName, value]) => {
        if (!formRef.elements.namedItem(inputName)) {
            return;
        }
        formRef.elements.namedItem(inputName).value = value;
    });
};

const clearForm = (formRef, formConfig) => {
    formConfig.map(key => {
        formRef.elements.namedItem(key).value = '';
    });
};

export const createFormEntity = (formRef, formConfig) => {
    //Return values of form as object
    const getValue = () => extractFormData(formRef, formConfig);
    //Fills all possible form fields based on incoming object
    // {{ [key:string] }} formValue
    const setValue = (formValue) => fillFormWithData(formRef, formValue);
    //clear the form
    const clear = () => clearForm(formRef, formConfig);
    
    return {
        getValue,
        setValue,
        clear
    };
};