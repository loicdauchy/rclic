<?php

namespace App\Repository;

use App\Entity\Appointments;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Appointments|null find($id, $lockMode = null, $lockVersion = null)
 * @method Appointments|null findOneBy(array $criteria, array $orderBy = null)
 * @method Appointments[]    findAll()
 * @method Appointments[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AppointmentsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Appointments::class);
    }

    /**
    * @return Appointments[] Returns an array of Appointments objects
    */  
    public function findAppointmentsByUser($user)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.users = :val')
            ->setParameter('val', $user)
            ->orderBy('a.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    /**
    * @return Appointments[] Returns an array of Appointments objects
    */  
    public function findAppointmentsByUserTakeAppointments($user)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.userTakeAppointments = :val')
            ->setParameter('val', $user)
            ->orderBy('a.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    /**
    * @return Appointments[] Returns an array of Appointments objects
    */  
    public function findAppointmentByGroupeId($users, $groupeId)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.groupeId = :val')
            ->setParameter('val', $groupeId)
            ->andWhere('a.users = :user')
            ->setParameter('user', $users)
            ->orderBy('a.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    /*
    public function findOneBySomeField($value): ?Appointments
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
