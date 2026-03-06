<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSeatRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'row_number' => ['required', 'integer', 'min:1'],
            'column_number' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('seats', 'column_number')->where(fn ($q) => $q
                    ->where('room_id', $this->input('room_id'))
                    ->where('row_number', $this->input('row_number'))
                ),
            ],
            'price_multiplier' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
