//step 1 - create form helper
export function fillFormData(form, formValue) {
    Object.entries(formValue).map(([inputName, value]) => {
        form.elements.namedItem(inputName).value = value;
    })
}

export function extractDataFromForm(formRef, formConfig) {
    return formConfig.reduce((acc, inputName) => {
        acc[inputName] = formRef.elements[inputName].value;
        return acc;
    }, {});
}

