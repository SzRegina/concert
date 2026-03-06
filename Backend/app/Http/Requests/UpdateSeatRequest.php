<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSeatRequest extends FormRequest
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
        $seat = $this->route('seat');
        $seatId = is_object($seat) ? ($seat->id ?? null) : $seat;

        return [
            'room_id' => ['sometimes', 'integer', 'exists:rooms,id'],
            'row_number' => ['sometimes', 'integer', 'min:1'],
            'column_number' => [
                'sometimes',
                'integer',
                'min:1',
                Rule::unique('seats', 'column_number')
                    ->ignore($seatId)
                    ->where(fn ($q) => $q
                        ->where('room_id', $this->input('room_id', is_object($seat) ? $seat->room_id : null))
                        ->where('row_number', $this->input('row_number', is_object($seat) ? $seat->row_number : null))
                    ),
            ],
            'price_multiplier' => ['sometimes', 'numeric', 'min:0'],
        ];
    }
}
