// validations/alignment.validation.js
import Joi from 'joi';

const soloADN = /^[ACGT]+$/i;
const soloARN = /^[ACGU]+$/i;

export const alignmentValidation = Joi.object({
  algorithm: Joi.string().valid('needleman', 'smith').required(),
  molecula: Joi.string().valid('ADN', 'ARN').required(),
  seq1: Joi.alternatives().conditional('molecula', {
    is: 'ADN',
    then: Joi.string().pattern(soloADN).required()
      .messages({ 'string.pattern.base': 'seq1 solo puede tener A, C, G, T para ADN' }),
    otherwise: Joi.string().pattern(soloARN).required()
      .messages({ 'string.pattern.base': 'seq1 solo puede tener A, C, G, U para ARN' })
  }),
  seq2: Joi.alternatives().conditional('molecula', {
    is: 'ADN',
    then: Joi.string().pattern(soloADN).required()
      .messages({ 'string.pattern.base': 'seq2 solo puede tener A, C, G, T para ADN' }),
    otherwise: Joi.string().pattern(soloARN).required()
      .messages({ 'string.pattern.base': 'seq2 solo puede tener A, C, G, U para ARN' })
  }),
  match: Joi.number().required().messages({
    'number.base': 'Debes ingresar un número para match',
    'number.required': 'match es obligatorio',
    'number.positive': 'Debes ingresar un valor positivo para match'
    
  }),
  mismatch: Joi.number().required().messages({
    'number.base': 'Debes ingresar un número para mismatch',
    'number.required': 'mismatch es obligatorio'
  }),
  gap: Joi.number().required().messages({
    'number.base': 'Debes ingresar un número para gap',
    'number.required': 'gap es obligatorio'
  })
});
