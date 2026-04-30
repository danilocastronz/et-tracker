export const Platform = {
  OS: 'ios',
  select: (obj) => obj.ios || obj.default,
};

export const StyleSheet = {
  create: (styles) => styles,
  flatten: (style) => (Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style ?? {}),
};

export const View = 'View';
export const Text = 'Text';
export const TextInput = 'TextInput';
export const Pressable = 'Pressable';
export const ScrollView = 'ScrollView';
export const Image = 'Image';
export const Alert = {
  alert: jest.fn(),
};
export const Dimensions = {
  get: jest.fn(() => ({ width: 375, height: 812 })),
};
export const ActionSheetIOS = {
  showActionSheetWithOptions: jest.fn(),
};
export const RefreshControl = 'RefreshControl';
export const KeyboardAvoidingView = 'KeyboardAvoidingView';
