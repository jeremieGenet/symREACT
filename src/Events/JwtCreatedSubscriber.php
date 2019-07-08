<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

/**
 * Permet d'ajouter le firstName et lastName à l'encryptage du toker JWT
 * Classe appelée grâce à la config dans le fichier config/services.yaml
 */
class JwtCreatedSubscriber
{
    public function updateJwtData(JWTCreatedEvent $event)
    {
        //dd($event);

        // On récup l'utilisateur (pour avoir son firsName et lastName)
        $user = $event->getUser();

        // On enrichi les data pour qu'elles contiennnent le fistName et le lastName
        $data = $event->getData();
        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);

        //dd($event->getData());

    }
}