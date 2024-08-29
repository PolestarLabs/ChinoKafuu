import { Member } from 'eris'
export class ButtonEvent {
  constructor(button) {
    this.customID = button.data.custom_id
    this.componentType = button.data.component_type
    this.member = new Member(button.member)
  }
}
