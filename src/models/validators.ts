// create helper functions for validator modules same file and exported
const emailRx =
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

// user validations

export function validateEmail(email: string) {
  if (!email) {
    throw new Error("Email address is required");
  }
  if (!email.match(emailRx)) {
    throw new Error("Invalid email format");
  }
}

export function validatePassword(password: string) {
  if (!password) {
    throw new Error("password is missing");
  }
  if (password.length < 8 || password.length > 32) {
    throw new Error("password must be between 8, and 32 characters");
  }
}

export function validateName(firstName: string, lastName: string) {
  if (!firstName || !lastName) {
    throw new Error("First and last name are required");
  }
  if (firstName.length < 3 || lastName.length < 3) {
    throw new Error("First and last shoud be a minimum of three characters");
  }
}

export function validateId(userId: number) {
  if (!userId) {
    throw new Error("user id is missing");
  }
  if (!Number.isInteger(userId) || userId < 1) {
    throw new Error("user id must be a number");
  }
}

// wav validations
export function validateWavId(wavId?: number) {
  if (!wavId) {
    throw new Error("Wav id is missing");
  }
  if (!Number.isInteger(wavId) || wavId < 1) {
    throw new Error("Invalid wav id");
  }
}

export function validateFileName(fileName: string) {
  if (!fileName) {
    throw new Error("file name is missing");
  }
}

export function validateDuration(duration: string) {
  if (!duration) {
    throw new Error("duration is missing");
  }
}

export function validateFormat(format: string) {
  if (!format) {
    throw new Error("expiration date is missing");
  }
  if (format && isNaN(parseInt(format))) {
    throw new Error("expiration date is missing");
  }
}

// wav metadata validations

// export function validateWavId(wavId?: number) {
//   if (!wavId) {
//     throw new Error("Wav id is missing");
//   }
//   if (!Number.isInteger(wavId) || wavId < 1) {
//     throw new Error("Invalid wav id");
//   }
// }

// Need to write validator functions for wav files and metadata files

// - `id`: An auto-incrementing primary key to uniquely identify each record.
// - `file_name`: The name of the WAV file.
// - `title`: Title of the audio file.
// - `artist`: Artist of the audio.
// - `album`: Album name.
// - `genre`: Genre of the audio.
// - `duration`: The duration of the audio in seconds.
// - `sample_rate`: The sample rate of the audio file (in Hz).
// - `bit_depth`: The bit depth, indicating audio quality.
// - `file_size`: Size of the file in bytes.
// - `creation_date`: Timestamp indicating when the record was created.
// - `last_modified_date`: Timestamp for when the record was last modified.
// - `comments`: Any additional comments or notes regarding the file.
