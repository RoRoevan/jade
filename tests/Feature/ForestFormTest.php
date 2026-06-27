<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ForestFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_forest_form_submission_is_saved_as_pending(): void
    {
        $response = $this->post('/forest-form', [
            'business_name' => 'Green Leaf Co',
            'contact_person' => 'Ana Santos',
            'email' => 'ana@example.com',
            'phone' => '09171234567',
            'preferred_date' => '2026-07-10',
            'proposal_description' => 'We want to partner on eco packaging.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('status', 'Your meeting request has been submitted and is now pending admin review.');
    }
}
