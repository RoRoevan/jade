<?php

namespace App\Mail;

use App\Models\ForestPartnershipRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ForestPartnershipStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ForestPartnershipRequest $request)
    {
    }

    public function build(): self
    {
        $statusLabel = ucfirst($this->request->status);

        return $this->from(config('mail.from.address'), config('mail.from.name'))
            ->subject('Forest Partnership Request ' . $statusLabel)
            ->markdown('emails.forest-partnership-status')
            ->with([
                'request' => $this->request,
                'statusLabel' => $statusLabel,
            ]);
    }
}
