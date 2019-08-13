<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Invoice;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @method Invoice|null find($id, $lockMode = null, $lockVersion = null)
 * @method Invoice|null findOneBy(array $criteria, array $orderBy = null)
 * @method Invoice[]    findAll()
 * @method Invoice[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvoiceRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Invoice::class);
    }

    // Requête DQL Doctrine pour récup le numéro le plus grand des factures (chrono) liés à un utilisateur (User) et lui ajouter 1
    public function findNextChrono(User $user)
    {
        try{
            return $this->createQueryBuilder('i') // alias i pour l'entité Invoice.php
            ->select('i.chrono') // on sélectionne le champ chrono et la table Invoice
            ->join('i.customer', "c") // on récup le customer lié à la facture, et on nomme son alias "c"
            ->where("c.user = :user") // là ou le client lié à la facture vaut :user (alias défini ci-après dans setParameter)
            ->setParameter("user", $user) // là ou le client lié à la facture est l'entité User reçue en paramètre
            ->orderBy("i.chrono", "DESC") // on la trie par ordre desc pour un ordre décroissant (du numéro de facture le plus haut ou plus bas)
            ->setMaxResults(1) // et de cette requête on ne veut qu'un résultat
            ->getQuery() // On récup la requête
            ->getSingleScalarResult() + 1; // on récup sous forme de numéro le résutat de la requête et on lui ajoute 1
        // Si il y a une exception on retourne 1 (Pour le cas de la création de la première facture de l'application, car aucun "chrono" n'existe encore)
        }catch(\Exception $e){
            return 1;
        }
        
    }

    // /**
    //  * @return Invoice[] Returns an array of Invoice objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Invoice
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
