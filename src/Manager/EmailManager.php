<?php

namespace App\Manager;

use Twig\Environment;

class EmailManager{

   /**
    * @var \Swift_Mailer
    */
    private $mailer;

   /**
    * @var Environment
    */
    private $renderer;

    public function __construct(\Swift_Mailer $mailer, Environment $renderer)
    {
        $this->mailer = $mailer;
        $this->renderer = $renderer;
    }

    public function confirmationMail($name, $company, $collaborateur, $hour, $sendTo){

        $message = (new \Swift_Message('Confirmation de rendez-vous'))
        ->setFrom('contact@webantek.com')
        ->setTo($sendTo)
        ->setBody(
            $this->renderer->render(
                'emails/confirmation.html.twig', [
                    'name' => $name,
                    'company' => $company,
                    'collaborateur' => $collaborateur,
                    'heure' => $hour
            ]),
            'text/html'
        );

        $this->mailer->send($message);

        return true;

    }
}