<?php

namespace App\Events;

use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use App\Entity\Invoice;

/**
 * Permet de générer un numéro de facture (Chrono) qui est le numéro de la dernière facture + 1 (et ajoute la date du jour si elle n'est pas renseignée)
 * Cette classe est automatiquement appelée à chaque requête requete http (parce qu'elle implémente l'interface EventSubscriberInterface)
 */
class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    private $security;
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents()
    {
        return[
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(GetResponseForControllerResultEvent $event)
    {
        
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($invoice instanceof Invoice && $method === "POST"){
            
            $nextChrono = $this->repository->findNextChrono($this->security->getUser());
            $invoice->setChrono($nextChrono);
            //dd($invoice->getChrono());

            // TODO : A déplacer dans une classe dédiée
            // Si la date n'est pas défini on lui donne la date du jour
            if(empty($invoice->getSentAt())){
                $invoice->setSentAt(new \DateTime());
            }
        }
    }
}