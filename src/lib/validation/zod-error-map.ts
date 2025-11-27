import { z } from 'zod'

const formatPath = (path?: readonly (string | number | symbol)[]) => (path && path.length ? path.join('.') : 'value')

export const initZodErrorMap = () => {
  z.config({
    customError(issue) {
      const field = formatPath(issue.path)

      if (issue.code === 'invalid_type') {
        if (issue.received === 'undefined') {
          return { message: `${field} is required` }
        }

        return { message: `${field} must be ${String(issue.expected)}` }
      }

      return { message: issue.message || 'Invalid value' }
    },
  })
}
