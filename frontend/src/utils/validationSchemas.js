import * as yup from 'yup';

export const ratingValidationSchema = yup.object({
  rating: yup
    .number()
    .min(1, 'Rating must be at least 1')
    .max(10, 'Rating cannot exceed 10')
    .required('Rating is required'),
  title: yup
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(50, 'Title cannot exceed 50 characters')
    .required('Title is required'),
  comment: yup
    .string()
    .min(20, 'Comment must be at least 20 characters')
    .max(500, 'Comment cannot exceed 500 characters')
    .required('Comment is required'),
  nickname: yup
    .string()
    .min(3, 'Nickname must be at least 3 characters')
    .max(20, 'Nickname cannot exceed 20 characters')
    .required('Nickname is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .optional(), 
});

export const createValidationSchema = yup.object({
  second_type: yup
    .string(),
  type: yup
    .string() 
    .required('Type is required'),
  hp: yup
    .number()
    .min(1, 'HP must be at least 1')
    .max(255, 'HP cannot exceed 255')
    .required('HP is required'),
  attack: yup
    .number()
    .min(1, 'Attack must be at least 1')
    .max(255, 'Attack cannot exceed 255')
    .required('Attack is required'),
  defense: yup
    .number()
    .min(1, 'Defense must be at least 1')
    .max(255, 'Defense cannot exceed 255')
    .required('Defense is required'), 
  speed: yup
    .number()
    .min(1, 'Speed must be at least 1')
    .max(255, 'Speed cannot exceed 255')
    .required('Speed is required'),
  name: yup
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(20, 'Name cannot exceed 20 characters')
    .required('Name is required'),
  information: yup
    .string()
    .min(10, 'Information must be at least 10 characters')
    .max(200, 'Information cannot exceed 200 characters')
    .required('Information is required'), 
});