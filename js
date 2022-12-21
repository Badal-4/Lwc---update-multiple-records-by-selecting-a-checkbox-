import { LightningElement, api, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class MyLWC extends LightningElement {
  @api recordId;
  @api objectApiName;

  @wire(getAccounts)
  accounts;

  selectedAccountIds = [];

  handleChange(event) {
    // Add or remove the account ID from the list of selected IDs
    if (event.target.checked) {
      this.selectedAccountIds.push(event.target.value);
    } else {
      this.selectedAccountIds = this.selectedAccountIds.filter(id => id !== event.target.value);
    }
  }

  handleSave() {
    // Update the account industry to 'Software'
    const fields = { Industry: 'Software' };

    // Create an array to store the update promises
    const updates = [];

    // Iterate over the selected account IDs and update each one
    this.selectedAccountIds.forEach(id => {
      updates.push(updateRecord({ fields, recordId: id }));
    });

    // Wait for all updates to complete
    Promise.all(updates)
      .then(() => {
        // Refresh the Apex data to reflect the updates
        return refreshApex(this.accounts);
      })
      .catch(error => {
        console.error('Error updating records', error);
      });
  }
}
