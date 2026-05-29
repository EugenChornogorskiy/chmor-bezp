import { useEffect, useState } from 'react';
import { RatingStars } from "../../components/RatingStars";
import { useFormik } from 'formik'; 
import { ratingValidationSchema } from '../../utils/validationSchemas';
export function RatingForm( { setRatings,ratings}: any) {    
  const [value, setValue] = useState( 0);  
  const formik = useFormik({
      initialValues: {
        rating: 0,
        title: '',
        comment: '',
        email: '',
        nickname: '',
      },
      validationSchema: ratingValidationSchema,
      onSubmit: (values, { resetForm }) => {
        setRatings((prev: any[]) => [...prev, { ...values, rating: value, id: Date.now(), date: new Date().toLocaleDateString('pl-PL') }]);
        resetForm();
        setValue(0)
      },
    });  
  return ( 
  <form onSubmit={formik.handleSubmit}>  
    <div id="rating-form">
        <p id="rating-pokemon">Rating pokemon</p>
        
          <div id="comment-inputs">
              <input type="text" id="comment-title" name="title" placeholder="Title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
              {formik.touched.title && formik.errors.title && (
                <div className="error">{formik.errors.title}</div>
              )}
              <RatingStars value={value} setValue={(v:any) => setValue(v) } formik={formik}/>
              {formik.touched.rating && formik.errors.rating && (
                <div className="error">{formik.errors.rating}</div>
              )}
              < textarea id="comment-value" name="comment" placeholder="Comment value" value={formik.values.comment} onChange={formik.handleChange} onBlur={formik.handleBlur}></textarea>
              {formik.touched.comment && formik.errors.comment && (
                <div className="error">{formik.errors.comment}</div>
              )}
              <input type="text" placeholder="Email" id="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
              {formik.touched.email && formik.errors.email && (
                <div className="error">{formik.errors.email}</div>
              )}
              <input type="text" placeholder="Nickname" id="nickname" value={formik.values.nickname} onChange={formik.handleChange} onBlur={formik.handleBlur}/> 
              {formik.touched.nickname && formik.errors.nickname && (
                <div className="error">{formik.errors.nickname}</div>
              )}
          </div>
        
        <button id="send-rating" type="submit" >Send rating</button>
    </div>
  </form>
  )
}