export const supportedState = (options = {
  name: '',
  description: '',
  isSupported: false
}) => ({
  name: '',
  description: '',
  isSupported: false,
  ...options
})

export const defineArgs = (options = {
  name: '',
  description: '',
  isRequired: false,
  providers: [],
}) => ({
  name: '',
  description: '',
  isRequired: false,
  providers: [],
  ...options
})

export const defineProvider = (options = {
  name: '',
  description: '',
}) => ({
  name: '',
  description: '',
  ...options
})

export const defineCommand = (options = {
  name: '',
  description: '',
  args: [],
  providers: [],
  supports: [],
  example: [],
}) => ({
  name: '',
  description: '',
  args: [],
  providers: [],
  supports: [],
  example: [],
  ...options
})