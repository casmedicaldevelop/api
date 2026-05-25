import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { UpdateAiDto } from './update-ai.dto'

describe('UpdateAiDto', () => {
  it('S2: valid payload with apiKey and model passes validation', async () => {
    const dto = plainToInstance(UpdateAiDto, {
      aiApiKey: 'AIzaSy-test-key',
      aiModel: 'gemini-3-flash-preview',
    })
    const errors = await validate(dto)
    expect(errors).toHaveLength(0)
  })

  it('S5: empty apiKey (undefined) is valid — clears key in DB', async () => {
    const dto = plainToInstance(UpdateAiDto, {
      aiModel: 'gemini-3-flash-preview',
    })
    const errors = await validate(dto)
    expect(errors).toHaveLength(0)
  })

  it('S7: missing aiModel fails validation', async () => {
    const dto = plainToInstance(UpdateAiDto, {
      aiApiKey: 'some-key',
    })
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].property).toBe('aiModel')
  })

  it('S7: empty string aiModel fails validation', async () => {
    const dto = plainToInstance(UpdateAiDto, {
      aiModel: '',
    })
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })
})
