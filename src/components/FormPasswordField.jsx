import { Form, unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

function FormPasswordField({ value, handleChange }) {
  return (
    <Form.Field className="signin--form__password-field" name='password'>
        <Form.Label className="signin--form__password-label block font-medium mb-2">
            Password:
        </Form.Label>

        <Form.Control asChild>
            <PasswordToggleField.Root asChild>
            <div
                className="signin--form__password-toggle-field border-2 border-white rounded-md
                            hover:border-amber-500 focus-within:border-amber-500 outline-none flex items-center
                            gap-2 py-1.5 px-2.5 font-medium w-full mb-3
                        "
            >
                <PasswordToggleField.Input
                    type="password"
                    className="signin--form__password-input outline-none flex-grow"
                    minLength={6}
                    value={value}
                    onChange={handleChange}
                    name='password'
                    required
                />

                <PasswordToggleField.Toggle>
                <PasswordToggleField.Icon
                    visible={<FaRegEye className="text-white text-xl" />}
                    hidden={<FaRegEyeSlash className="text-white text-xl" />}
                />
                </PasswordToggleField.Toggle>
            </div>
            </PasswordToggleField.Root>
        </Form.Control>

        <Form.Message
            className={
            "signin--form__password-message text-amber-500 mb-4" +
            " font-medium block"
            }
            match="valueMissing"
        >
            Please enter your password
        </Form.Message>

        <Form.Message
            className={
            "signin--form__password-message text-amber-500 mb-4" +
            " font-medium block"
            }
            match="tooShort"
        >
            Your password is too short
        </Form.Message>
    </Form.Field>
  )
}

export default FormPasswordField
