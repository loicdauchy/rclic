<?php

namespace App\Repository;

use App\Entity\FichesClients;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method FichesClients|null find($id, $lockMode = null, $lockVersion = null)
 * @method FichesClients|null findOneBy(array $criteria, array $orderBy = null)
 * @method FichesClients[]    findAll()
 * @method FichesClients[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FichesClientsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FichesClients::class);
    }

   /**
    * @return FichesClients[] Returns an array of FichesClients objects
    */   
    public function findFichesClientsByCommerce($value)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.commerce = :val')
            ->setParameter('val', $value)
            ->orderBy('f.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

   /**
    * @return FichesClients[] Returns an array of FichesClients objects
    */   
    public function findFicheClientByCritere($nom)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.nom LIKE :nom')
            ->setParameter('nom', '%'.$nom.'%')
            ->orderBy('f.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

   /**
    * @return FichesClients Returns an array of FichesClients objects
    */   
    public function findFicheClientByTel($tel)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.tel = :tel')
            ->setParameter('tel', $tel)
            ->setMaxResults(1)
            ->getQuery()
            ->getResult()
        ;
    }


    /*
    public function findOneBySomeField($value): ?FichesClients
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
