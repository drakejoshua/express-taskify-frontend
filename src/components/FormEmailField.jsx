import { Form } from 'radix-ui'

function FormEmailField({ value, handleChange }) {
  return (
    <Form.Field className="signin--form__email-field" name='email'>
        <Form.Label className="signin--form__email-label block font-medium mb-2 text-white">
            Email:
        </Form.Label>

        <Form.Control asChild>
            <input
            type="email"
            className="signin--form__email-input border-2 mb-2
                border-white rounded-md py-1.5 px-2.5 font-medium w-full
                hover:border-amber-500 focus:border-amber-500 outline-none 
                text-white"
            name='email'
            value={value}
            onChange={handleChange}
            required
            />
        </Form.Control>

        <Form.Message
            className={
            "signin--form__email-message text-amber-500 mb-4" +
            " font-medium block"
            }
            match="valueMissing"
        >
            Please enter your email
        </Form.Message>

        <Form.Message
            className={
            "signin--form__email-message text-amber-500 mb-4" +
            " font-medium block"
            }
            match="typeMismatch"
        >
            Please enter a valid email
        </Form.Message>
    </Form.Field>
  )
}

export default FormEmailField
