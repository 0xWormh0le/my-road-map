export function getUserInitials(user) {
  if (!user || !user.first_name || !user.last_name) return '';
  return `${user.first_name.toUpperCase()[0]}${user.last_name.toUpperCase()[0]}`;
}

export function prepareErrorMessage(errorResponse) {
  if (errorResponse.response && errorResponse.response.data && typeof errorResponse.response.data === "object") {
    if (errorResponse.response.data.non_field_errors)
      return errorResponse.response.data.non_field_errors;

    return Object.entries(errorResponse.response.data).map(keyValue => keyValue.join(': ')).join('\n');
  }

  if (errorResponse.message) {
    return errorResponse.message;
  }
  return 'Unknown error occurred.';
}
